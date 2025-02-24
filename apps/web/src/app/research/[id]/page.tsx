import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ResearchDetail } from '@/components/research/ResearchDetail'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ResearchDetailPageProps {
  params: {
    id: string
  }
}

// Loading UI
function ResearchDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[150px] w-full" />
    </div>
  )
}

export default async function ResearchDetailPage({
  params,
}: ResearchDetailPageProps) {
  // Ensure params are resolved before rendering
  const resolvedParams = await Promise.resolve(params)
  
  return (
    <Suspense fallback={<ResearchDetailSkeleton />}>
      <ResearchContent params={resolvedParams} />
    </Suspense>
  )
}

async function ResearchContent({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: research, error } = await supabase
    .from('research_history')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !research) {
    notFound()
  }

  return <ResearchDetail research={research} />
} 