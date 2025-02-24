import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MessageSquare, Search } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { ResearchMode } from "@/types/research"

interface ModeToggleProps {
  value: ResearchMode
  onValueChange: (value: ResearchMode) => void
}

export function ModeToggle({ value, onValueChange }: ModeToggleProps) {
  // Prevent deselection by only calling onValueChange if the new value is defined
  const handleValueChange = (newValue: string | undefined) => {
    if (newValue) {
      onValueChange(newValue as ResearchMode)
    }
  }

  return (
    <TooltipProvider>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={handleValueChange}
        className="rounded-lg bg-none border border-primary/25"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem 
              value="standard" 
              className={cn(
                "p-3 transition-all duration-200 ease-in-out",
                value === "standard" 
                  ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white" 
                  : "hover:bg-primary/50 hover:text-foreground"
              )}
              aria-label="Standard Research Mode"
            >
              <Search className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Standard Research Mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem 
              value="conversation" 
              className={cn(
                "p-3 transition-all duration-200 ease-in-out",
                value === "conversation" 
                  ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white" 
                  : "hover:bg-primary/50 hover:text-foreground"
              )}
              aria-label="Conversational Mode"
            >
              <MessageSquare className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>Conversational Mode</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  )
}