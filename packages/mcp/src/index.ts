import { deepResearch, type ResearchProgress, type ResearchResult } from 'open-deep-research'

export type ResearchJob = {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress?: ResearchProgress
  result?: ResearchResult
  error?: string
}

export type ResearchParams = {
  id: string
  query: string
  breadth: number
  depth: number
  onProgress?: (progress: ResearchProgress) => void
  onComplete?: (result: ResearchResult) => void
  onError?: (error: Error) => void
}

class MCPWrapper {
  private jobs: Map<string, ResearchJob> = new Map()

  async startResearch(params: ResearchParams): Promise<ResearchJob> {
    const job: ResearchJob = {
      id: params.id,
      status: 'pending'
    }
    
    this.jobs.set(params.id, job)

    try {
      job.status = 'running'
      
      const result = await deepResearch({
        query: params.query,
        breadth: params.breadth,
        depth: params.depth,
        onProgress: (progress) => {
          job.progress = progress
          params.onProgress?.(progress)
        }
      })

      job.status = 'completed'
      job.result = result
      
      params.onComplete?.(result)
      return job
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'Unknown error'
      
      if (error instanceof Error) {
        params.onError?.(error)
      }
      
      throw error
    }
  }

  getJobStatus(id: string): ResearchJob | undefined {
    return this.jobs.get(id)
  }
}

export const mcp = new MCPWrapper() 