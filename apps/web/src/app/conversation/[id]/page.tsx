'use client'

import { use } from 'react'
import { useEffect } from 'react'
import { useConversationStore } from '@/store/conversation'
import { ConversationalResearch } from '@/components/research/ConversationalResearch'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ConversationPage({ params }: PageProps) {
  const { id } = use(params)
  const { setMessages } = useConversationStore()

  useEffect(() => {
    async function loadConversation() {
      try {
        const response = await fetch(`/api/conversation/history?conversationId=${id}`)
        if (!response.ok) {
          throw new Error('Failed to load conversation')
        }
        
        const { data } = await response.json()
        if (data?.[0]?.messages) {
          setMessages(data[0].messages)
        }
      } catch (error) {
        console.error('Error loading conversation:', error)
        // In a real app, we should handle this error in the UI
      }
    }

    if (id !== 'new') {
      loadConversation()
    } else {
      // Clear messages when starting a new conversation
      setMessages([])
    }

    // Cleanup function to clear messages when unmounting
    return () => {
      setMessages([])
    }
  }, [id, setMessages])

  return <ConversationalResearch conversationId={id} />
} 