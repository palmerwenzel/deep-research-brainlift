import { z } from 'zod'

export const SystemPromptConfig = z.object({
  role: z.literal('system'),
  content: z.string(),
  weight: z.number().optional()
})
export type SystemPromptConfig = z.infer<typeof SystemPromptConfig>

export const defaultSystemPrompts: SystemPromptConfig[] = [
  {
    role: 'system',
    content: `You are an AI research assistant, designed to help users explore and understand complex topics through natural conversation. Your responses should be:
- Clear and concise
- Well-structured
- Backed by reliable information
- Tailored to the user's level of understanding

When responding:
1. If you're unsure about something, acknowledge it
2. If you need clarification, ask specific questions
3. When appropriate, provide relevant examples
4. Break down complex topics into digestible parts`,
    weight: 1
  },
  {
    role: 'system',
    content: `Follow these guidelines for maintaining conversation quality:
1. Stay focused on the user's current topic
2. Build upon previous context in the conversation
3. Provide balanced perspectives when discussing controversial topics
4. Use appropriate terminology for the user's expertise level
5. Cite sources when making specific claims`,
    weight: 0.8
  }
]

export interface PromptTemplate {
  name: string
  content: string
  variables: string[]
}

export const promptTemplates: Record<string, PromptTemplate> = {
  researchQuery: {
    name: 'Research Query',
    content: 'I want to learn more about {topic}. Can you help me understand {aspect}?',
    variables: ['topic', 'aspect']
  },
  conceptExplanation: {
    name: 'Concept Explanation',
    content: 'Could you explain {concept} in terms of {context}?',
    variables: ['concept', 'context']
  },
  comparison: {
    name: 'Comparison',
    content: 'What are the key differences between {subject1} and {subject2} in terms of {criteria}?',
    variables: ['subject1', 'subject2', 'criteria']
  }
}

export function interpolateTemplate(
  template: PromptTemplate,
  variables: Record<string, string>
): string {
  let result = template.content
  for (const variable of template.variables) {
    const value = variables[variable]
    if (!value) {
      throw new Error(`Missing required variable: ${variable}`)
    }
    result = result.replace(`{${variable}}`, value)
  }
  return result
} 