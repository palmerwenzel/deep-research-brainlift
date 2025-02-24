export interface ResearchParams {
  query: string
  breadth: number
  depth: number
}

export interface ResearchResult {
  learnings: string[]
  visitedUrls: string[]
}

export interface ResearchResponse {
  status: 'completed' | 'error'
  id: string
  params: ResearchParams
  result: ResearchResult | null
  error?: {
    error: string
    message?: string
    details?: any
  }
}

export interface ResearchHistory {
  id: string
  user_id: string
  query: string
  breadth: number
  depth: number
  learnings: string[]
  visited_urls: string[]
  created_at: string
  updated_at: string
}

export interface ResearchHistoryCreate {
  query: string
  breadth: number
  depth: number
  learnings: string[]
  visited_urls: string[]
}

export type ResearchMode = 'standard' | 'conversation'; 