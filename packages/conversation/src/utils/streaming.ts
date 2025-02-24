import { type Message } from '../types/message'

export interface StreamCallbacks {
  onStart?: () => void
  onToken?: (token: string) => void
  onCompletion?: (message: Message) => void
  onError?: (error: Error) => void
}

export async function processMessageStream(
  stream: ReadableStream,
  callbacks?: StreamCallbacks
): Promise<string> {
  callbacks?.onStart?.()
  let content = ''

  try {
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      content += chunk
      callbacks?.onToken?.(chunk)
    }

    callbacks?.onCompletion?.({
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date()
    })

    return content
  } catch (error) {
    const e = error instanceof Error ? error : new Error('Unknown error')
    callbacks?.onError?.(e)
    throw e
  }
}

export function createStreamingResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 