'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useResearchStore } from "@/store/research-store"
import { ResearchResults } from "./ResearchResults"
import { type ResearchParams, type ResearchResponse } from "@/types/research"
import { useRouter } from "next/navigation"
import { useResearchHistory } from '@/hooks/use-research-history'

const formSchema = z.object({
  query: z.string().min(1, "Please enter a research query"),
  breadth: z.number().min(1).max(5),
  depth: z.number().min(1).max(3),
})

type FormValues = ResearchParams

const defaultValues: FormValues = {
  query: "",
  breadth: 1,
  depth: 1,
}

export function ResearchForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResearchResponse | null>(null)
  const { setParameters } = useResearchStore()
  const { refresh: refreshHistory } = useResearchHistory()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    setParameters(values)

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data: ResearchResponse = await response.json()

      if (!response.ok || data.status === 'error') {
        throw new Error(
          data.error?.message || 
          data.error?.error || 
          'Failed to start research'
        )
      }

      setResult(data)

      if (data.status === 'completed' && data.result) {
        const historyResponse = await fetch('/api/research/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: values.query,
            breadth: values.breadth,
            depth: values.depth,
            learnings: data.result.learnings,
            visited_urls: data.result.visitedUrls,
          }),
        })

        if (!historyResponse.ok) {
          console.error('Failed to save research to history')
        } else {
          const historyData = await historyResponse.json()
          await refreshHistory()
          router.push(`/research/${historyData.data.id}`)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto">
        <div className="space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader className="pb-4 space-y-1">
              <CardTitle className="text-base font-medium text-primary">
                Configure Your Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="query"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Research Query</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your research topic..." 
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What would you like to research? Be as specific as possible.
                    </FormDescription>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="breadth"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 text-center">
                      <FormLabel>Search Breadth</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <div className="bg-background/50 rounded-lg p-1">
                            <ToggleGroup 
                              type="single" 
                              value={field.value.toString()}
                              onValueChange={(value: string) => field.onChange(parseInt(value, 10))}
                              className="flex gap-1"
                            >
                              {[1, 2, 3, 4, 5].map((value) => (
                                <ToggleGroupItem
                                  key={value}
                                  value={value.toString()}
                                  className="h-8 w-8 rounded-md data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/30"
                                  aria-label={`Search breadth ${value}`}
                                >
                                  {value}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        How many parallel search paths to explore
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 text-center">
                      <FormLabel>Search Depth</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <div className="bg-background/50 rounded-lg p-1">
                            <ToggleGroup 
                              type="single"
                              value={field.value.toString()}
                              onValueChange={(value: string) => field.onChange(parseInt(value, 10))}
                              className="flex gap-1"
                            >
                              {[1, 2, 3].map((value) => (
                                <ToggleGroupItem
                                  key={value}
                                  value={value.toString()}
                                  className="h-8 w-8 rounded-md data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/30"
                                  aria-label={`Search depth ${value}`}
                                >
                                  {value}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        How deep to explore each search path
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <ResearchResults data={result} isLoading={isLoading} />

          <Button 
            type="submit" 
            size="lg" 
            variant="gradient"
            className="w-full font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching...
              </>
            ) : (
              'Start Research'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 