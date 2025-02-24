import { NextResponse } from 'next/server'
import { mcp } from '@packages/mcp'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { query, breadth = 2, depth = 1 } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const result = await mcp.startResearch({
      id: crypto.randomUUID(),
      query,
      breadth,
      depth
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Command API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 