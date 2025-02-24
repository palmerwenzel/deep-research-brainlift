'use client'

import { AlertCircle, FileQuestion } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HistoryItem, HistoryItemSkeleton } from './HistoryItem'
import { useResearchHistory } from '@/hooks/use-research-history'
import type { ResearchHistory } from '@/types/research'

export function HistoryList() {
  const { history, error, isLoading, mutate } = useResearchHistory()

  async function handleDelete(id: string) {
    try {
      // Optimistically remove the item from the list
      mutate(
        history?.filter((item: ResearchHistory) => item.id !== id),
        false // Don't revalidate immediately
      )

      const response = await fetch(`/api/research/history?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const json = await response.json()
        throw new Error(json.error)
      }

      // If successful, revalidate to ensure our optimistic update was correct
      mutate()
    } catch (err) {
      console.error('Failed to delete research:', err)
      // Revalidate to restore the item if deletion failed
      mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <HistoryItemSkeleton key={i} />
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
            {error instanceof Error ? error.message : 'Failed to load research history'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!history?.length) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <FileQuestion className="h-12 w-12 mb-4 text-muted-foreground/50" />
        <p>No research history yet</p>
        <p className="text-sm">Start a new research to see it here</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      {history.map((item: ResearchHistory) => (
        <HistoryItem
          key={item.id}
          item={item}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
} 