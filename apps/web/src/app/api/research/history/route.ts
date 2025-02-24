import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for new research entries
const createHistorySchema = z.object({
  query: z.string(),
  breadth: z.number().int().min(1).max(5),
  depth: z.number().int().min(1).max(3),
  learnings: z.array(z.string()),
  visited_urls: z.array(z.string().url())
})

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('research_history')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching research history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research history' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = createHistorySchema.parse(body)
    
    // Include the user_id in the insert
    const { data, error } = await supabase
      .from('research_history')
      .insert([{
        ...validated,
        user_id: user.id
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error creating research history:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create research history' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing research history ID' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('research_history')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only delete their own entries

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting research history:', error)
    return NextResponse.json(
      { error: 'Failed to delete research history' },
      { status: 500 }
    )
  }
} 