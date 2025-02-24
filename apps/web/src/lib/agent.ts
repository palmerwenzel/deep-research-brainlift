import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage, AIMessageChunk, ToolMessage, BaseMessage } from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createClient } from './supabase/server'
import { ToolRunnableConfig } from "@langchain/core/tools";
import { CallbackManagerForToolRun } from "@langchain/core/callbacks/manager";

// Message types
type MessageRole = "system" | "user" | "assistant";
interface DatabaseMessage {
  role: MessageRole;
  content: string;
}

// Commands
interface UpdateEntityCommand {
  type: "update_entity";
  payload: Partial<CurrentEntity>;
}

interface LogCommand {
  type: "log";
  payload: { message: string };
}

type AppCommand = UpdateEntityCommand | LogCommand;

const getEntityTableFromType = (type: string) => {
    switch (type) {
        case "Domain":
            return "domains";
        case "Area":
            return "areas";
        case "Concept":
            return "concepts";
        case "Aspect":
            return "aspects";
        default:
            throw new Error(`Invalid entity type: ${type}`);
    }
}

const getEntityParentIdField = (entityType: string): string => {
    switch (entityType) {
      case "Domain": return "";
      case "Area": return "domain_id";
      case "Concept": return "area_id"; 
      case "Aspect": return "concept_id";
      default: throw new Error(`Invalid entity type: ${entityType}`);
    }
  }

const isAIMessage = (message: BaseMessage): message is AIMessage => {
  return message instanceof AIMessage || message instanceof AIMessageChunk;
};

// Ensure API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

// System prompt with tool descriptions and guidelines
const DEFAULT_SYSTEM_PROMPT = `You are an AI research assistant that helps users explore topics through conversation while quietly building a structured knowledge graph. Your goal is to infer a hierarchy from the user's input without mentioning the hierarchy terms directly.

Steps:
1. **Clarify Intent**: Use "gather_information" to ask natural questions until you have ALL of the following:
   - The broad field or domain they're interested in
   - The specific area or technology within that domain
   - The particular concept or technique they want to explore
   - The specific aspect or component they want to understand
   Example flow:
   - "What broader field does this relate to?"
   - "Which specific area or technology interests you?"
   - "What particular aspect would you like to understand?"

2. **Infer the Hierarchy**: Once you have gathered ALL the required information, map the input to:
   - Domain: Broad field of study (e.g., "Artificial Intelligence", "Computer Science")
   - Area: Major subfield or technology (e.g., "Natural Language Processing", "Machine Learning")
   - Concept: Specific technique or framework (e.g., "RAG", "Transformers")
   - Aspect: Particular component or characteristic (e.g., "Architecture", "Implementation")

3. **Check Existing Structure**: ONLY after completing steps 1 and 2, use "query_entities".

4. **Fill Gaps**: ONLY after step 3, use "create_entity" for missing pieces.

5. **Converse Naturally**: After the structure is complete, use "get_information" and "update_information".

Rules:
- ALWAYS use "gather_information" multiple times until you have complete understanding
- NEVER proceed to "query_entities" or "create_entity" until you've gathered all necessary context
- Keep responses natural and conversational
- If unsure about any aspect, continue asking questions

Tools:
- "gather_information": Ask a question. Input: { "question": "string" }
- "query_entities": Search entities. Input: { "keywords": ["string"] }
- "create_entity": Create entities. Input: { "entities": [{ "type": "Domain/Area/Concept/Aspect", "name": "string", "parentId": "string optional" }] }
- "get_information": Retrieve details. Input: { "entityId": "string" }
- "update_information": Add details. Input: { "entityId": "string", "bulletPoint": "string", "dokLevel": "number" }`

// **Tools**

class GatherInformationTool extends StructuredTool {
    name = "gather_information";
    description = "Asks the user a natural question to clarify their intent.";
    schema = z.object({
      question: z.string().describe("A conversational question to ask the user"),
    });
  
    async _call({ question }: z.infer<typeof this.schema>) {
      console.log("[GatherInformationTool] Asking:", question);
      return { message: question };
    }
}

class QueryEntitiesTool extends StructuredTool {
    name = "query_entities";
    description = "Searches for existing entities across all levels with a suggestion for the hierarchy.";
    schema = z.object({
      keywords: z.array(z.string()).describe("Keywords from the conversation"),
    });
  
    async _call({ keywords }: z.infer<typeof this.schema>, _, config) {
      const supabase = await createClient();
      const userId = config?.configurable?.userId;
      if (!userId) return { message: "User ID required" };

      // Normalize keywords for search
      const normalizedKeywords = keywords.map(k => k.toLowerCase().trim());
      
      const tables = ["domains", "areas", "concepts", "aspects"];
      const results: { level: string; id: string; name: string; parentId?: string }[] = [];
  
      // First try exact matches
      for (const table of tables) {
        const parentField = { areas: "domain_id", concepts: "area_id", aspects: "concept_id" }[table] || "";
        const selectFields = parentField ? `id, name, ${parentField}` : "id, name";
        
        // Try each keyword individually
        for (const keyword of normalizedKeywords) {
          const { data, error } = await supabase
            .from(table)
            .select(selectFields)
            .eq("user_id", userId)
            .ilike("name", keyword);
            
          if (!error && data?.length) {
            results.push(...data.map(item => ({
              level: table.slice(0, -1),
              id: item.id,
              name: item.name,
              ...(parentField ? { parentId: item[parentField] } : {}),
            })));
            continue; // Found exact match, move to next table
          }

          // If no exact match, try partial matches
          const { data: fuzzyData, error: fuzzyError } = await supabase
            .from(table)
            .select(selectFields)
            .eq("user_id", userId)
            .or(`name.ilike.%${keyword}%,name.ilike.${keyword}%,name.ilike.%${keyword}`);

          if (!fuzzyError && fuzzyData?.length) {
            results.push(...fuzzyData.map(item => ({
              level: table.slice(0, -1),
              id: item.id,
              name: item.name,
              ...(parentField ? { parentId: item[parentField] } : {}),
            })));
          }
        }
      }
  
      // Suggest a hierarchy based on keywords and results
      const suggestion = await this.inferHierarchy(normalizedKeywords, results);
      return { results, suggestion };
    }
  
    private async inferHierarchy(keywords: string[], results: any[]) {
      const hierarchy = { Domain: "", Area: "", Concept: "", Aspect: "" };
      
      // Try to find existing entities first
      const existingDomain = results.find(r => r.level === "Domain")?.name || "";
      const existingArea = results.find(r => r.level === "Area")?.name || "";
      const existingConcept = results.find(r => r.level === "Concept")?.name || "";
      const existingAspect = results.find(r => r.level === "Aspect")?.name || "";

      // If we have existing entities, use them
      if (existingDomain) hierarchy.Domain = existingDomain;
      if (existingArea) hierarchy.Area = existingArea;
      if (existingConcept) hierarchy.Concept = existingConcept;
      if (existingAspect) hierarchy.Aspect = existingAspect;

      // If we're missing any levels, use the model to infer them
      if (!existingDomain || !existingArea || !existingConcept || !existingAspect) {
        const context = keywords.join(" ");
        const prompt = `Given the context "${context}", help organize it into a knowledge hierarchy. The hierarchy should be domain-agnostic and follow these levels:

1. Domain: The broadest field of study or practice this belongs to
2. Area: A major subfield or significant area within the domain
3. Concept: The specific technique, idea, or framework being discussed
4. Aspect: The particular characteristic, component, or perspective being explored

For example, if discussing "Shakespearean character development in Hamlet":
Domain: "Literature"
Area: "Drama"
Concept: "Character Development"
Aspect: "Psychological Evolution"

Or if discussing "photosynthesis efficiency in desert plants":
Domain: "Biology"
Area: "Plant Physiology"
Concept: "Photosynthesis"
Aspect: "Environmental Adaptation"

Based on the context provided, suggest appropriate values for any missing levels:
${!existingDomain ? "Domain: [need suggestion]" : `Domain: ${existingDomain}`}
${!existingArea ? "Area: [need suggestion]" : `Area: ${existingArea}`}
${!existingConcept ? "Concept: [need suggestion]" : `Concept: ${existingConcept}`}
${!existingAspect ? "Aspect: [need suggestion]" : `Aspect: ${existingAspect}`}`;

        try {
          const response = await model.invoke([new SystemMessage(prompt)]);
          const content = response.content;
          
          // Extract suggestions from the response
          if (!existingDomain) {
            const domainMatch = content.match(/Domain:\s*"([^"]+)"/);
            if (domainMatch) hierarchy.Domain = this.capitalizeFirst(domainMatch[1]);
          }
          
          if (!existingArea) {
            const areaMatch = content.match(/Area:\s*"([^"]+)"/);
            if (areaMatch) hierarchy.Area = this.capitalizeFirst(areaMatch[1]);
          }
          
          if (!existingConcept) {
            const conceptMatch = content.match(/Concept:\s*"([^"]+)"/);
            if (conceptMatch) hierarchy.Concept = this.capitalizeFirst(conceptMatch[1]);
          }
          
          if (!existingAspect) {
            const aspectMatch = content.match(/Aspect:\s*"([^"]+)"/);
            if (aspectMatch) hierarchy.Aspect = this.capitalizeFirst(aspectMatch[1]);
          }
        } catch (error) {
          console.error("Error inferring hierarchy:", error);
          // Fallback to simple capitalization if LLM fails
          if (!existingDomain && keywords.length > 0) hierarchy.Domain = this.capitalizeFirst(keywords[0]);
          if (!existingArea && keywords.length > 1) hierarchy.Area = this.capitalizeFirst(keywords[1]);
          if (!existingConcept && keywords.length > 2) hierarchy.Concept = this.capitalizeFirst(keywords[2]);
          if (!existingAspect && keywords.length > 3) hierarchy.Aspect = this.capitalizeFirst(keywords[3]);
        }
      }
      
      return hierarchy;
    }

    private capitalizeFirst(str: string): string {
      if (!str) return "";
      const words = str.split(" ");
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }
  }

  class CreateEntityTool extends StructuredTool {
    name = "create_entity";
    description = "Creates one or more entities in the knowledge graph.";
    schema = z.object({
      entities: z.array(z.object({
        type: z.enum(["Domain", "Area", "Concept", "Aspect"]),
        name: z.string(),
        parentId: z.string().optional().describe("MUST be a valid UUID from a previously created parent entity. Do NOT use entity names as IDs."),
      })),
    });
  
    async _call({ entities }: z.infer<typeof this.schema>, _, config) {
      const supabase = await createClient();
      const userId = config?.configurable?.userId;
      if (!userId) return { message: "User ID required" };

      const created = [];
      for (const entity of entities) {
        const table = getEntityTableFromType(entity.type);
        const parentIdField = getEntityParentIdField(entity.type);
        
        // First check if entity exists
        const { data: existing, error: queryError } = await supabase
          .from(table)
          .select("id, name")
          .eq("user_id", userId)
          .ilike("name", entity.name)
          .single();

        if (existing) {
          // Entity exists, use it
          created.push({ 
            type: entity.type, 
            id: existing.id, 
            name: existing.name,
            parentId: entity.parentId,
            status: "existing"
          });
          continue;
        }

        // Entity doesn't exist, create it
        const data = { 
          name: entity.name, 
          user_id: userId,
          ...(entity.parentId && parentIdField ? { [parentIdField]: entity.parentId } : {})
        };
        
        const { data: result, error } = await supabase.from(table).insert(data).select().single();
        if (error) {
          if (error.message.includes("duplicate key value")) {
            // Double-check for race condition
            const { data: retryExisting } = await supabase
              .from(table)
              .select("id, name")
              .eq("user_id", userId)
              .ilike("name", entity.name)
              .single();
            
            if (retryExisting) {
              created.push({ 
                type: entity.type, 
                id: retryExisting.id, 
                name: retryExisting.name,
                parentId: entity.parentId,
                status: "existing"
              });
              continue;
            }
          }
          return { message: `Failed to create ${entity.type}: ${error.message}` };
        }
        created.push({ 
          type: entity.type, 
          id: result.id, 
          name: result.name, 
          parentId: entity.parentId,
          status: "created" 
        });
      }
  
      const message = created.map(e => 
        `${e.status === "existing" ? "Using existing" : "Created"}: ${e.name}`
      ).join(" → ");

      return {
        message,
        commands: created.map(e => ({ 
          type: "update_entity", 
          payload: { [e.type.toLowerCase()]: { id: e.id, name: e.name, parentId: e.parentId } } 
        })),
      };
    }
  }

class GetInformationTool extends StructuredTool {
  name = "get_information";
  description = "Retrieves the user's previously saved knowledge and understanding about an aspect. An empty result means this is a new area of learning for the user - an opportunity to help them start building their knowledge.";
  schema = z.object({
    entityId: z.string().describe("ID of the aspect to check the user's current understanding of"),
  });

  async _call({ entityId }: z.infer<typeof this.schema>, runManager?: CallbackManagerForToolRun, parentConfig?: ToolRunnableConfig): Promise<{ bulletPoints: any; message: string; commands?: AppCommand[] }> {
    const supabase = await createClient();
    
    const { data, error } = await supabase.from("aspects").select("information").eq("id", entityId).single();
    if (error) return { bulletPoints: null, message: `Entity ${entityId} not found.` };
  
    const info = data?.information || { bullet_points: { dok_1: [], dok_2: [], dok_3: [], dok_4: [] } };
    return {
      bulletPoints: info.bullet_points,
      message: `Found ${Object.values(info.bullet_points).flat().length} bullet points for ${entityId}`,
      commands: [{ type: "update_entity", payload: { information: info } }],
    };
  }
}

class UpdateInformationTool extends StructuredTool {
  name = "update_information";
  description = "Helps the user build their personal knowledge by adding a new learning point. Use this to capture new insights, whether the user is just starting to learn about an aspect or expanding their existing understanding. Each bullet point should be a clear, concrete piece of knowledge the user can refer back to.";
  schema = z.object({
    entityId: z.string().optional().describe("ID of the aspect to add knowledge to (defaults to current entity)"),
    bulletPoint: z.string().describe("A clear, concrete piece of knowledge for the user to remember"),
    dokLevel: z.number().min(1).max(4).describe("Depth of Knowledge level: 1=Basic Facts, 2=Concepts/Skills, 3=Strategic Thinking, 4=Extended Thinking"),
  });

  async _call({ entityId, bulletPoint, dokLevel }: z.infer<typeof this.schema>,
    runManager?: CallbackManagerForToolRun,
    parentConfig?: ToolRunnableConfig
  ): Promise<{ message: string; commands?: AppCommand[] }> {
    const state = parentConfig?.configurable || {};
    const currentEntity = state.currentEntity || {};
    const id = entityId || currentEntity.aspect?.id;
    if (!id) return { message: "No entity specified or active." };
  
    const supabase = await createClient();
    
    const { data, error } = await supabase.from("aspects").select("information").eq("id", id).single();
    if (error) return { message: `Entity ${id} not found.` };
  
    const info = data?.information || { bullet_points: { dok_1: [], dok_2: [], dok_3: [], dok_4: [] } };
    info.bullet_points[`dok_${dokLevel}`].push(bulletPoint);
  
    const { error: updateError } = await supabase.from("aspects").update({ information: info }).eq("id", id);
    if (updateError) return { message: `Failed to update ${id}: ${updateError.message}` };
  
    return {
      message: `Added bullet point to ${id}: "${bulletPoint}" (DoK ${dokLevel})`,
      commands: [{ type: "update_entity", payload: { information: info } }],
    };
  }
}

class ProposeSplitTool extends StructuredTool {
  name = "propose_split";
  description = "Suggests splitting an aspect's Information if it exceeds 4000 tokens.";

  schema = z.object({
    entityId: z.string().describe("ID of the entity to check"),
  });

  async _call({ entityId }: z.infer<typeof this.schema>): Promise<{ message: string; suggestions: string[] }> {
    const supabase = await createClient();

    const { data, error } = await supabase.from("aspects").select("information").eq("id", entityId).single();
    if (error) return { message: `Entity ${entityId} not found.`, suggestions: [] };

    const info = data?.information || { bullet_points: { dok_1: [], dok_2: [], dok_3: [], dok_4: [] } };
    const text = Object.values(info.bullet_points).flat().join(" ");
    const tokenCount = text.split(" ").length; // Placeholder until tokenizer is added

    if (tokenCount > 4000) {
      const suggestions = ["Aspect 1", "Aspect 2"];
      return {
        message: `Information for ${entityId} exceeds 4000 tokens (${tokenCount}). Suggest splitting.`,
        suggestions,
      };
    }
    return { message: "No split needed.", suggestions: [] };
  }
}

async function processToolOutput(state: AppState): Promise<Partial<AppState>> {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage instanceof ToolMessage) {
      console.log("[processToolOutput] Processing ToolMessage:", lastMessage.content);
      try {
        const parsed = JSON.parse(String(lastMessage.content));
        return {
          messages: [lastMessage], // Keep the ToolMessage in history
          commands: parsed.commands || [],
        };
      } catch (e) {
        console.error("[processToolOutput] Error parsing ToolMessage:", e);
      }
    }
    return {};
  }

const tools = [
  new GatherInformationTool(),
  new QueryEntitiesTool(),
  new CreateEntityTool(),
  new UpdateInformationTool(),
  new GetInformationTool(),
  new ProposeSplitTool(),
];

// **Model and Workflow**

const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.7,
  streaming: true,
}).bindTools(tools);

const memory = new MemorySaver();

interface CurrentEntity {
  domain: { id: string; name: string };
  area: { id: string; name: string; parentId: string };
  concept: { id: string; name: string; parentId: string };
  aspect: { id: string; name: string; parentId: string };
  information: {
    bullet_points: {
      dok_1: string[];
      dok_2: string[];
      dok_3: string[];
      dok_4: string[];
    };
  };
}

// Define the custom state annotation
const CurrentEntityAnnotation = Annotation.Root({
  currentEntity: Annotation<CurrentEntity>,
});

// Combine with MessagesAnnotation for the full state
const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  ...CurrentEntityAnnotation.spec,
  commands: Annotation<AppCommand[]>({ reducer: (x, y) => y }),
});

async function handleCommands(state: AppState): Promise<Partial<AppState>> {
  const commands = state.commands || [];
  let updatedEntity = { ...state.currentEntity };

  for (const command of commands) {
    switch (command.type) {
      case "update_entity":
        updatedEntity = { ...updatedEntity, ...command.payload };
        break;
      case "log":
        console.log(command.payload.message);
        break;
    }
  }

  return { currentEntity: updatedEntity, commands: [] };
}

// Export the full state type
type AppState = typeof StateAnnotation.State;

function shouldContinue(state: AppState): "tools" | "handleCommands" | "__end__" {
    const lastMessage = state.messages[state.messages.length - 1];
    console.log("[shouldContinue] Last message:", {
      type: lastMessage.constructor.name,
      tool_calls: isAIMessage(lastMessage) ? lastMessage.tool_calls : undefined,
      name: lastMessage instanceof ToolMessage ? lastMessage.name : undefined,
    });

    // If we have commands to process, handle them first
    if (state.commands?.length > 0) {
      console.log("[shouldContinue] Routing to handleCommands");
      return "handleCommands";
    }

    // If this is a gather_information response, end to wait for user input
    if (lastMessage instanceof ToolMessage && lastMessage.name === "gather_information") {
      console.log("[shouldContinue] Ending after gather_information");
      return "__end__";
    }

    if (isAIMessage(lastMessage) && lastMessage.tool_calls?.length) {
      const toolCall = lastMessage.tool_calls[0];
      
      // Check if we're trying to use query_entities or create_entity too early
      if ((toolCall.name === "query_entities" || toolCall.name === "create_entity")) {
        // Count how many gather_information exchanges we've had
        const gatherCount = state.messages.filter(m => 
          m instanceof ToolMessage && m.name === "gather_information"
        ).length;

        // We need at least 2 gather_information exchanges before proceeding
        if (gatherCount < 2) {
          console.log("[shouldContinue] Not enough context gathered, forcing gather_information");
          // Override the tool call to gather more information
          lastMessage.tool_calls = [{
            name: "gather_information",
            args: { question: "Could you tell me more about what specific aspects interest you?" },
            id: "forced_gather",
            type: "tool_call"
          }];
        }
      }

      console.log("[shouldContinue] Routing to tools");
      return "tools";
    }

    console.log("[shouldContinue] Continuing workflow");
    return "__end__";
  }

  async function callModel(state: AppState) {
    const { domain, area, concept, aspect } = state.currentEntity || {};
    const isHierarchySet = domain && area && concept && aspect;
    const mode = isHierarchySet ? "Conversation" : "Setup";
    
    const promptWithState = `${DEFAULT_SYSTEM_PROMPT}\n\nCurrent State: ${JSON.stringify(state.currentEntity)}\nMode: ${mode}`;
    const messagesWithState = [...state.messages, new SystemMessage(promptWithState)];
    const response = await model.invoke(messagesWithState);
    console.log("[callModel] Model response:", {
      content: response.content,
      tool_calls: response.tool_calls,
    });
    return { messages: [response] };
}

const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", new ToolNode(tools))
  .addNode("processToolOutput", processToolOutput)
  .addNode("handleCommands", handleCommands)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "processToolOutput")
  .addEdge("processToolOutput", "handleCommands")
  .addEdge("handleCommands", "agent");

const persistentGraph = workflow.compile({ checkpointer: memory });

// **Helper Functions**

function convertToLangChainMessages(messages: DatabaseMessage[], includeSystem = true) {
  const validatedMessages = messages
    .filter((msg, index, arr) => {
      if (msg.role === "system") return arr.findIndex(m => m.role === "system") === index;
      return true;
    })
    .map(msg => {
      switch (msg.role) {
        case "system": return new SystemMessage(msg.content);
        case "assistant": return new AIMessage(msg.content);
        case "user": return new HumanMessage(msg.content);
      }
    });

  if (includeSystem && !validatedMessages.some(msg => msg instanceof SystemMessage)) {
    validatedMessages.unshift(new SystemMessage(DEFAULT_SYSTEM_PROMPT));
  }

  return validatedMessages;
}

async function* streamResponse(
    messages: DatabaseMessage[],
    config: { thread_id: string; userId: string; isNewConversation?: boolean }
  ) {
    const langChainMessages = convertToLangChainMessages(messages, config.isNewConversation);
    const initialState: AppState = {
      messages: langChainMessages,
      currentEntity: {
        domain: { id: "", name: "" },
        area: { id: "", name: "", parentId: "" },
        concept: { id: "", name: "", parentId: "" },
        aspect: { id: "", name: "", parentId: "" },
        information: { bullet_points: { dok_1: [], dok_2: [], dok_3: [], dok_4: [] } },
      },
      commands: [],
    };
  
    const stream = await persistentGraph.stream(initialState, {
      configurable: { thread_id: config.thread_id, userId: config.userId },
    });
  
    for await (const event of stream) {
      console.log("[streamResponse] Received event:", Object.keys(event));
      
      // Only yield actual content messages
      if (event.agent?.messages) {
        const message = event.agent.messages[0];
        console.log("[streamResponse:agent] Message:", {
          content: message.content,
          tool_calls: message.tool_calls,
        });
        if (message.content) {
          yield message.content;
        }
      }

      // Log other events for debugging but don't yield them
      if (event.tools?.messages) {
        const toolMessage = event.tools.messages[0];
        console.log("[streamResponse:tools] Tool message:", toolMessage);
      }
      if (event.handleCommands?.currentEntity) {
        console.log("[streamResponse:commands] Entity updated");
      }
    }
  
    const finalState = await persistentGraph.getState({ configurable: { thread_id: config.thread_id } });
    console.log("[streamResponse] Final state messages:", finalState.values.messages.length);
  }

async function startConversation(message: string, userId: string) {
  const messages: DatabaseMessage[] = [
    { role: "system", content: DEFAULT_SYSTEM_PROMPT },
    { role: "user", content: message },
  ];
  const thread_id = crypto.randomUUID();
  return { messages, thread_id, userId };
}

async function resumeConversation(thread_id: string, messages: DatabaseMessage[], userId: string) {
    const validatedMessages = messages.map(msg => ({
      role: (msg.role || "user") as MessageRole,
      content: msg.content,
    }));
    // Check if the last message was a tool call and append the response if missing
    const lastMessage = validatedMessages[validatedMessages.length - 1];
    const prevMessage = validatedMessages[validatedMessages.length - 2];
    if (
      prevMessage?.role === "assistant" &&
      lastMessage?.role === "user" &&
      messages.some(m => m.content.includes("gather_information"))
    ) {
      validatedMessages.splice(-1, 0, {
        role: "assistant" as MessageRole,
        content: JSON.stringify({ message: lastMessage.content }),
      });
    }
    return { messages: validatedMessages, thread_id, userId };
  }

export {
  startConversation,
  resumeConversation,
  streamResponse,
  convertToLangChainMessages,
  type DatabaseMessage,
  type MessageRole,
};