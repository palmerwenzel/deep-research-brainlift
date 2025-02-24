'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react'
import type { ResearchHistory } from '@/types/research'

interface HistoryItemProps {
  item: ResearchHistory
  onDelete: (id: string) => Promise<void>
}

export function HistoryItem({ item, onDelete }: HistoryItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this research?')) {
      setIsDeleting(true)
      try {
        await onDelete(item.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card 
      className="group transition-all duration-200 cursor-pointer hover:bg-gradient-to-b hover:from-primary/5 hover:to-primary/2 bg-gradient-to-b from-background/40 to-background/60 backdrop-blur-[1px] border-border/40 relative overflow-hidden"
      onClick={() => router.push(`/research/${item.id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-4 relative">
        <div className="space-y-2">
          <div className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {item.query}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary-foreground/80">
              {item.learnings.length} learnings
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center relative">
        <div className="flex gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs border-border/40 bg-background/40">
            Depth: {item.depth}
          </Badge>
          <Badge variant="outline" className="text-xs border-border/40 bg-background/40">
            Breadth: {item.breadth}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete research</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Loading skeleton for HistoryItem
export function HistoryItemSkeleton() {
  return (
    <Card className="animate-pulse bg-gradient-to-b from-background/40 to-background/60 border-border/40">
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 bg-primary/5" />
          <Skeleton className="h-4 w-1/2 bg-primary/5" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 bg-primary/5" />
          <Skeleton className="h-5 w-16 bg-primary/5" />
        </div>
      </CardFooter>
    </Card>
  )
} 