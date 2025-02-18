/**
 * page.tsx
 * -----------
 * Landing page for Deep Research Agent.
 */

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto p-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card 
        className="w-full max-w-md"
        variant="gradient"
        isHoverable
      >
        <CardHeader>
          <CardTitle className="bg-gradient-primary text-transparent bg-clip-text leading-[1.4]">
            Deep Research Agent
          </CardTitle>
          <CardDescription>
            AI-powered deep research and knowledge exploration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Development Environment
            </h3>
            <ul className="grid gap-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span>
                Next.js App Router with TypeScript
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span>
                Tailwind CSS + Shadcn UI
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">✓</span>
                Custom Theme System
              </li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button variant="gradient-animated" className="flex-1">
              Get Started
            </Button>
            <Button variant="outline-primary" className="flex-1">
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
