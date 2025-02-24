import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  startConversation,
  resumeConversation,
  streamResponse
} from '@/lib/agent'

const RequestSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional()
})

export async function POST(request: Request) {
  try {
    console.log('Starting conversation request')
    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    console.log('User authenticated:', user.id)

    const json = await request.json()
    const body = RequestSchema.parse(json)
    console.log('Request body:', { 
      message: body.message,
      conversationId: body.conversationId 
    })

    let conversationState: { messages: any[]; thread_id: string }
    let existingConversation = false

    // If we have a conversation ID and it's not a new conversation
    if (body.conversationId) {
      console.log('Loading existing conversation:', body.conversationId)
      const { data: conversationData, error: conversationError } = await supabase
        .from('conversation_history')
        .select('messages')
        .eq('id', body.conversationId)
        .eq('user_id', user.id)
        .single()

      if (conversationError) {
        console.error('Failed to load conversation:', conversationError)
        return NextResponse.json(
          { error: 'Failed to load conversation' },
          { status: 500 }
        )
      }

      if (conversationData?.messages) {
        console.log('Resuming conversation with messages:', conversationData.messages.length)
        conversationState = await resumeConversation(
          body.conversationId,
          [...conversationData.messages, { role: 'user', content: body.message }],
          user.id
        )
        existingConversation = true
      } else {
        console.error('Conversation not found:', body.conversationId)
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }
    } else {
      console.log('Starting new conversation')
      conversationState = await startConversation(body.message, user.id)

      // Create the conversation in the database first
      const { data: newConversation, error: createError } = await supabase
        .from('conversation_history')
        .insert({
          id: conversationState.thread_id,
          user_id: user.id,
          messages: [
            { role: 'system', content: conversationState.messages[0].content },
            { role: 'user', content: body.message }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create conversation:', createError)
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        )
      }

      console.log('Created new conversation:', newConversation.id)
    }

    console.log('Conversation state prepared:', {
      thread_id: conversationState.thread_id,
      messageCount: conversationState.messages.length
    })

    // Create a new ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log('Starting stream response')
          let content = ''
          const responseStream = streamResponse(
            conversationState.messages,
            {
              thread_id: conversationState.thread_id,
              userId: user.id,
              isNewConversation: !existingConversation
            }
          )

          // If this is a new conversation, send the ID first
          if (!existingConversation) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ conversationId: conversationState.thread_id })}\n\n`
              )
            )
          }

          console.log('Stream created, waiting for tokens')
          for await (const token of responseStream) {
            content += token
            const data = `data: ${JSON.stringify({ token })}\n\n`
            controller.enqueue(new TextEncoder().encode(data))
          }
          console.log('Stream completed, content length:', content.length)

          // Update the conversation with the assistant's response
          if (existingConversation) {
            console.log('Updating existing conversation:', conversationState.thread_id)
            
            // Get existing messages without the new user message (which was added temporarily for the model)
            const existingMessages = conversationState.messages.slice(0, -1)
            
            const { error: updateError } = await supabase
              .from('conversation_history')
              .update({
                messages: [
                  ...existingMessages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                  })),
                  { role: 'user', content: body.message },
                  { role: 'assistant', content }
                ],
                updated_at: new Date().toISOString()
              })
              .eq('id', conversationState.thread_id)
              .eq('user_id', user.id)

            if (updateError) {
              console.error('Failed to update conversation:', updateError)
            }
          } else {
            // Update the new conversation with the assistant's response
            const { error: updateError } = await supabase
              .from('conversation_history')
              .update({
                messages: [
                  { role: 'system', content: conversationState.messages[0].content },
                  { role: 'user', content: body.message },
                  { role: 'assistant', content }
                ],
                updated_at: new Date().toISOString()
              })
              .eq('id', conversationState.thread_id)
              .eq('user_id', user.id)

            if (updateError) {
              console.error('Failed to update new conversation:', updateError)
            }
          }

          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Error in stream controller:', error)
          controller.error(error)
        }
      }
    })

    console.log('Returning stream response')
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Top-level error in conversation stream:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
} 