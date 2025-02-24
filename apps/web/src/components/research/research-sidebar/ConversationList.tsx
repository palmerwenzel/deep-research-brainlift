'use client'

import { AlertCircle, MessageSquare } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ConversationItem, ConversationItemSkeleton } from './ConversationItem'
import { useConversationHistory } from '@/hooks/use-conversation-history'
import type { Conversation } from './ConversationItem'

export function ConversationList() {
  const { conversations, error, isLoading, mutate } = useConversationHistory()

  async function handleDelete(id: string) {
    try {
      // Optimistically remove the item from the list
      mutate(
        conversations?.filter((item: Conversation) => item.id !== id),
        false // Don't revalidate immediately
      )

      const response = await fetch(`/api/conversation/history?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const json = await response.json()
        throw new Error(json.error)
      }

      // If successful, revalidate to ensure our optimistic update was correct
      mutate()
    } catch (err) {
      console.error('Failed to delete conversation:', err)
      // Revalidate to restore the item if deletion failed
      mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <ConversationItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load conversations'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!conversations?.length) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground/50" />
        <p>No conversations yet</p>
        <p className="text-sm">Start a new chat to see it here</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      {conversations.map((item: Conversation) => (
        <ConversationItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
} 