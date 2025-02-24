import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ResearchState {
  query: string
  breadth: number
  depth: number
  setParameters: (params: Partial<Pick<ResearchState, 'query' | 'breadth' | 'depth'>>) => void
  reset: () => void
}

const defaultValues = {
  query: '',
  breadth: 2,
  depth: 1,
}

export const useResearchStore = create<ResearchState>()(
  persist(
    (set) => ({
      ...defaultValues,
      setParameters: (params) => set((state) => ({ ...state, ...params })),
      reset: () => set(defaultValues),
    }),
    {
      name: 'research-store',
    }
  )
) 