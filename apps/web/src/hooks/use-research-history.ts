import useSWR from 'swr'
import type { ResearchHistory } from '@/types/research'

interface ResearchHistoryResponse {
  data: ResearchHistory[]
}

async function fetchResearchHistory(): Promise<ResearchHistory[]> {
  const response = await fetch('/api/research/history')
  if (!response.ok) {
    throw new Error('Failed to fetch research history')
  }
  const { data } = await response.json() as ResearchHistoryResponse
  return data
}

export function useResearchHistory() {
  const { 
    data: history,
    error,
    isLoading,
    mutate
  } = useSWR<ResearchHistory[]>('research-history', fetchResearchHistory, {
    revalidateOnFocus: false, // Only revalidate manually or on mount
  })

  return {
    history,
    error,
    isLoading,
    // Helper to refresh the list
    refresh: () => mutate(),
    // Helper for optimistic updates
    mutate,
  }
} 