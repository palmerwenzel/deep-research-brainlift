import { z } from 'zod'
import { Message, MessageThread } from './message'

export const AgentTool = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.unknown()),
  handler: z.function()
    .args(z.any())
    .returns(z.promise(z.unknown()))
})
export type AgentTool = z.infer<typeof AgentTool>

export const AgentMemory = z.object({
  shortTerm: z.array(Message),
  workingContext: z.record(z.unknown())
})
export type AgentMemory = z.infer<typeof AgentMemory>

export const AgentConfig = z.object({
  tools: z.array(AgentTool).optional(),
  maxContextLength: z.number().default(100),
  temperature: z.number().default(0.7),
  model: z.string()
})
export type AgentConfig = z.infer<typeof AgentConfig>

export const AgentContext = z.object({
  messages: MessageThread,
  memory: AgentMemory,
  config: AgentConfig
})
export type AgentContext = z.infer<typeof AgentContext> 