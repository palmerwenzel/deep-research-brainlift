'use client'

import { ResearchForm } from "@/components/research/ResearchForm"
import { ConversationalResearch } from "@/components/research/ConversationalResearch"
import { ResearchHeader } from "@/components/research/ResearchHeader"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { ResearchMode } from "@/types/research"

export default function ResearchPage() {
  const [mode, setMode] = useState<ResearchMode>('standard')
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('id')

  // If there's a conversation ID, switch to conversational mode
  useEffect(() => {
    if (conversationId) {
      setMode('conversation')
    }
  }, [conversationId])

  // Handle mode changes
  const handleModeChange = (newMode: ResearchMode) => {
    setMode(newMode)
    // If switching to standard mode, remove conversation ID from URL
    if (newMode === 'standard' && conversationId) {
      router.replace('/research')
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ResearchHeader mode={mode} onModeChange={handleModeChange} />

      <div className="flex-1 min-h-0">
        {mode === 'standard' ? (
          <div className="container p-8 h-full overflow-auto">
            <div className="max-w-2xl mx-auto">
              <ResearchForm />
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            <ConversationalResearch conversationId={undefined} />
          </div>
        )}
      </div>
    </div>
  )
}