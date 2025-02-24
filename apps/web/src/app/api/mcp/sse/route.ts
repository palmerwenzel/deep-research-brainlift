import { NextResponse } from 'next/server'
import { mcp } from '@packages/mcp'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Define the research tool
const TOOLS = {
  research: {
    name: 'research',
    description: 'Performs deep research on a given topic',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The research query'
        },
        breadth: {
          type: 'number',
          description: 'How many parallel search paths to explore (1-5)',
          minimum: 1,
          maximum: 5,
          default: 2
        },
        depth: {
          type: 'number',
          description: 'How deep to explore each search path (1-3)',
          minimum: 1,
          maximum: 3,
          default: 1
        }
      },
      required: ['query']
    }
  }
}

export async function GET(request: Request) {
  // Early return if the client has disconnected
  if (request.signal.aborted) {
    return new Response(null, { status: 499 }) // Client Closed Request
  }

  const headersList = headers()
  const searchParams = new URL(request.url).searchParams
  const tool = searchParams.get('tool')
  
  // Set up SSE headers
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message with tools
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
        type: 'connected',
        tools: Object.values(TOOLS)
      })}\n\n`))

      // If no tool is specified, just send the welcome message and keep alive
      if (!tool) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
          type: 'info',
          message: 'Connected to SSE endpoint. Waiting for tool invocation.'
        })}\n\n`))
        return
      }

      // Handle disconnection
      request.signal.addEventListener('abort', () => {
        controller.close()
      })

      if (tool === 'research') {
        const query = searchParams.get('query')
        if (!query) {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
            type: 'error',
            error: 'Query parameter is required for research tool'
          })}\n\n`))
          return
        }

        const breadth = parseInt(searchParams.get('breadth') ?? '2', 10)
        const depth = parseInt(searchParams.get('depth') ?? '1', 10)

        // Start the research process
        mcp.startResearch({
          id: crypto.randomUUID(),
          query,
          breadth,
          depth,
          onProgress: (progress) => {
            if (!request.signal.aborted) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                type: 'progress',
                tool: 'research',
                data: progress
              })}\n\n`))
            }
          },
          onComplete: (result) => {
            if (!request.signal.aborted) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                type: 'complete',
                tool: 'research',
                data: result
              })}\n\n`))
              controller.close()
            }
          },
          onError: (error) => {
            if (!request.signal.aborted) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
                type: 'error',
                tool: 'research',
                error: error.message
              })}\n\n`))
              controller.close()
            }
          }
        }).catch((error) => {
          if (!request.signal.aborted) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
              type: 'error',
              tool: 'research',
              error: error.message
            })}\n\n`))
            controller.close()
          }
        })
      } else {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({
          type: 'error',
          error: `Unknown tool: ${tool}`
        })}\n\n`))
        controller.close()
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 