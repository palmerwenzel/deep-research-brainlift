'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ResearchHistory } from "@/types/research"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ResearchDetailProps {
  research: ResearchHistory
}

export function ResearchDetail({ research }: ResearchDetailProps) {
  const router = useRouter()
  const formattedDate = new Date(research.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{research.query}</h1>
          <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant="outline" className="text-xs">
          Depth: {research.depth}
        </Badge>
        <Badge variant="outline" className="text-xs">
          Breadth: {research.breadth}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Key Learnings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none pl-0 space-y-4">
            {research.learnings.map((learning, index) => (
              <li key={index} className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {learning}
                </ReactMarkdown>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-2">
            {research.visited_urls.map((url, index) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {new URL(url).hostname}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 