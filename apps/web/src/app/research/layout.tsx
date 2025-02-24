import { ResearchSidebar } from '@/components/research/research-sidebar/ResearchSidebar'
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Research | Deep Research Agent",
  description: "Execute deep, iterative research queries with AI assistance",
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ResearchSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
} 