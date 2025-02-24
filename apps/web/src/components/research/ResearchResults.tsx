import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { type ResearchResponse } from "@/types/research"
import { Loader2 } from "lucide-react"

interface ResearchResultsProps {
  data: ResearchResponse | null
  isLoading: boolean
}

export function ResearchResults({ data, isLoading }: ResearchResultsProps) {
  if (!data && !isLoading) return null

  return (
    <Card variant="default">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-primary flex items-center gap-2">
          Research Results
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4 bg-primary/5" />
            <Skeleton className="h-4 w-5/6 bg-primary/5" />
            <Skeleton className="h-4 w-2/3 bg-primary/5" />
          </div>
        ) : data?.result ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Key Learnings</h3>
              <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                {data.result.learnings.map((learning, index) => (
                  <li key={index}>{learning}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Sources</h3>
              <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                {data.result.visitedUrls.map((url, index) => (
                  <li key={index}>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-primary"
                    >
                      {new URL(url).hostname}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
} 