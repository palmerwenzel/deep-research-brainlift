'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

export interface Conversation {
  id: string
  title?: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  created_at: string
}

interface ConversationItemProps {
  item: Conversation
  onDelete: (id: string) => void
}

export function ConversationItem({ item, onDelete }: ConversationItemProps) {
  const router = useRouter()

  function getConversationTitle(conversation: Conversation) {
    return conversation.title ?? 'Untitled Conversation'
  }

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 font-normal"
        onClick={() => router.push(`/conversation/${item.id}`)}
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <div className="flex-1 truncate text-left">
          <div className="truncate">{getConversationTitle(item)}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(item.created_at).toLocaleDateString()}
          </div>
        </div>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(item.id)
        }}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}

export function ConversationItemSkeleton() {
  return (
    <div className="px-2 py-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
} 