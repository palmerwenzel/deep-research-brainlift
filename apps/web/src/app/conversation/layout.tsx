import { ResearchSidebar } from '@/components/research/research-sidebar/ResearchSidebar'

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <ResearchSidebar />
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  )
} 