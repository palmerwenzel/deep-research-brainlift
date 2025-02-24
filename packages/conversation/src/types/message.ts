import { z } from 'zod'

export const MessageRole = z.enum(['user', 'assistant', 'system'])
export type MessageRole = z.infer<typeof MessageRole>

export const Message = z.object({
  id: z.string(),
  role: MessageRole,
  content: z.string(),
  timestamp: z.date(),
  metadata: z.object({
    confidence: z.number().optional(),
    toolUsage: z.object({
      name: z.string(),
      result: z.unknown()
    }).optional()
  }).optional()
})
export type Message = z.infer<typeof Message>

export const Conversation = z.object({
  id: z.string(),
  title: z.string().optional(),
  messages: z.array(Message),
  createdAt: z.date(),
  updatedAt: z.date()
})
export type Conversation = z.infer<typeof Conversation>

export const MessageThread = z.array(Message)
export type MessageThread = z.infer<typeof MessageThread>

// Remove conversation storage types as they'll be handled by the API layer 