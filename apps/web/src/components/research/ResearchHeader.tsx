import { ModeToggle } from "./ModeToggle"
import type { ResearchMode } from "@/types/research"

interface ResearchHeaderProps {
  mode: ResearchMode
  onModeChange: (mode: ResearchMode) => void
}

const modeConfig = {
  standard: {
    title: "Research",
    description: "Start your research journey by entering a topic and configuring your parameters."
  },
  conversation: {
    title: "Conversational Research",
    description: "Have a natural conversation with our AI to explore your research topic in depth."
  }
} as const

export function ResearchHeader({ mode, onModeChange }: ResearchHeaderProps) {
  const config = modeConfig[mode]
  
  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex flex-col items-center gap-6">
        <ModeToggle value={mode} onValueChange={onModeChange} />
        
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{config.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {config.description}
          </p>
        </header>
      </div>
    </div>
  )
} 