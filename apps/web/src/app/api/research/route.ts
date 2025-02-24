import { NextResponse } from 'next/server'
import { z } from 'zod'
import { deepResearch, type ResearchProgress, ResearchError, FirecrawlError } from 'open-deep-research/src/deep-research'
import { ConfigSchema } from 'open-deep-research/src/config'

// Validate environment variables
const config = ConfigSchema.parse({
  firecrawl: {
    baseUrl: process.env.FIRECRAWL_BASE_URL ?? 'http://localhost:3002',
    apiKey: process.env.FIRECRAWL_KEY,
    concurrencyLimit: 2,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL ?? 'gpt-4',
  },
})

// Define the schema for research parameters
const researchParamsSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  breadth: z.number().int().min(1).max(5).default(2),
  depth: z.number().int().min(1).max(3).default(1),
})

export type ResearchParams = z.infer<typeof researchParamsSchema>

export async function POST(request: Request) {
  try {
    // Ensure OpenAI API key is configured
    if (!config.openai.apiKey) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Configuration error',
          message: 'OpenAI API key is not configured',
          result: null,
        },
        { status: 500 }
      )
    }

    // Parse and validate the request body
    const body = await request.json()
    const validatedParams = researchParamsSchema.parse(body)

    // Generate a unique ID for this research request
    const researchId = crypto.randomUUID()

    // Call deepResearch with progress tracking
    const result = await deepResearch({
      ...validatedParams,
      onProgress: (progress: ResearchProgress) => {
        // TODO: In the future, we can use Server-Sent Events or WebSockets
        // to stream progress updates to the frontend
        console.log(`Research ${researchId} Progress:`, {
          ...progress,
          query: validatedParams.query,
        })
      },
    })

    return NextResponse.json({
      status: 'completed',
      id: researchId,
      params: validatedParams,
      result: {
        learnings: result.learnings,
        visitedUrls: result.visitedUrls,
      },
      error: null,
    })
  } catch (error) {
    console.error('Research API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Invalid parameters',
          details: error.errors,
          result: null,
        },
        { status: 400 }
      )
    }

    if (error instanceof FirecrawlError) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Search service error',
          message: error.message,
          result: null,
        },
        { status: 502 }
      )
    }

    if (error instanceof ResearchError) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Research processing error',
          message: error.message,
          result: null,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        status: 'error',
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        result: null,
      },
      { status: 500 }
    )
  }
} 