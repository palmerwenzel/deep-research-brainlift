import useSWR from 'swr'
import type { Conversation } from '@/components/research/research-sidebar/ConversationItem'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch conversations')
  }
  const json = await res.json()
  return json.data
}

export function useConversationHistory() {
  const { data, error, isLoading, mutate } = useSWR<Conversation[]>(
    '/api/conversation/history',
    fetcher
  )

  return {
    conversations: data,
    error,
    isLoading,
    mutate
  }
} 