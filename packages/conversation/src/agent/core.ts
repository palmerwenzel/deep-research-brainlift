import { AIProvider } from '../ai/provider'
import { AgentContext, AgentConfig, AgentTool } from '../types/agent'
import { Message } from '../types/message'

export class Agent {
  private provider: AIProvider
  private context: AgentContext

  constructor(apiKey: string, config: AgentConfig) {
    this.provider = new AIProvider(apiKey, config)
    this.context = {
      messages: [],
      memory: {
        shortTerm: [],
        workingContext: {}
      },
      config
    }
  }

  private async shouldUseTool(message: Message): Promise<AgentTool | null> {
    const tools = this.context.config.tools
    if (!tools?.length) return null

    for (const tool of tools) {
      if (message.content.toLowerCase().includes(tool.name.toLowerCase())) {
        return tool
      }
    }
    return null
  }

  private updateMemory(message: Message) {
    this.context.memory.shortTerm = [
      ...this.context.memory.shortTerm,
      message
    ].slice(-this.context.config.maxContextLength)
  }

  async processMessage(
    message: Message,
    onToken?: (token: string) => void
  ): Promise<Message> {
    try {
      this.context.messages.push(message)
      this.updateMemory(message)

      const tool = await this.shouldUseTool(message)
      if (tool) {
        try {
          const result = await tool.handler(message)
          const toolResponse: Message = {
            id: crypto.randomUUID(),
            role: 'system',
            content: JSON.stringify(result),
            timestamp: new Date(),
            metadata: {
              toolUsage: {
                name: tool.name,
                result
              }
            }
          }
          this.context.messages.push(toolResponse)
          this.updateMemory(toolResponse)
        } catch (error) {
          console.error(`Tool ${tool.name} failed:`, error)
          throw new Error(`Failed to execute tool ${tool.name}`)
        }
      }

      let response: Message
      if (onToken) {
        return new Promise((resolve) => {
          this.provider.completeStream(
            this.context.messages,
            onToken,
            (completionResponse) => {
              this.context.messages.push(completionResponse)
              this.updateMemory(completionResponse)
              resolve(completionResponse)
            }
          )
        })
      } else {
        response = await this.provider.complete(this.context.messages)
        this.context.messages.push(response)
        this.updateMemory(response)
      }

      return response
    } catch (error) {
      console.error('Error processing message:', error)
      throw error
    }
  }

  getContext(): AgentContext {
    return this.context
  }

  clearContext() {
    this.context.messages = []
    this.context.memory = {
      shortTerm: [],
      workingContext: {}
    }
  }
} 