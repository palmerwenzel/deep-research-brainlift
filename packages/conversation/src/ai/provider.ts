import OpenAI from 'openai'
import { Message, MessageRole } from '../types/message'
import { AgentConfig } from '../types/agent'

export class AIProvider {
  private client: OpenAI
  private config: AgentConfig

  constructor(apiKey: string, config: AgentConfig) {
    this.client = new OpenAI({ apiKey })
    this.config = config
  }

  private formatMessages(messages: Message[]) {
    // Take only the last maxContextLength messages
    const contextMessages = messages.slice(-this.config.maxContextLength)
    return contextMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  }

  async complete(messages: Message[]): Promise<Message> {
    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages: this.formatMessages(messages),
      temperature: this.config.temperature,
      stream: false
    })

    const choice = response.choices[0]
    if (!choice?.message) {
      throw new Error('No response from OpenAI')
    }

    return {
      id: crypto.randomUUID(),
      role: choice.message.role as MessageRole,
      content: choice.message.content ?? '',
      timestamp: new Date(),
      metadata: {
        confidence: choice.finish_reason === 'stop' ? 1.0 : 0.5
      }
    }
  }

  async completeStream(
    messages: Message[],
    onToken: (token: string) => void,
    onComplete: (message: Message) => void
  ): Promise<void> {
    const stream = await this.client.chat.completions.create({
      model: this.config.model,
      messages: this.formatMessages(messages),
      temperature: this.config.temperature,
      stream: true
    })

    let content = ''
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || ''
      content += token
      onToken(token)
    }

    onComplete({
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      metadata: {
        confidence: 1.0
      }
    })
  }
} 