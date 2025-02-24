'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useConversationStore } from "@/store/conversation"
import { useRouter } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ConversationHeader } from "./ConversationHeader"
import type { Message } from "@brainlift/conversation"
import type { FormEvent } from "react"

interface ConversationalResearchProps {
  conversationId?: string
}

export function ConversationalResearch({ conversationId }: ConversationalResearchProps) {
  const router = useRouter()
  const {
    messages,
    isLoading,
    error,
    currentMessage,
    isStreaming,
    addMessage,
    updateMessage,
    setLoading,
    setError,
    setCurrentMessage,
    setStreaming
  } = useConversationStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId)

  // Update active conversation ID when prop changes
  useEffect(() => {
    setActiveConversationId(conversationId)
  }, [conversationId])

  // Load conversation title on mount
  useEffect(() => {
    async function loadTitle() {
      if (!conversationId) return
      
      try {
        const response = await fetch(`/api/conversation/history?conversationId=${conversationId}`)
        if (!response.ok) throw new Error('Failed to load conversation')
        
        const { data } = await response.json()
        if (data?.[0]?.title) {
          setTitle(data[0].title)
        } else {
          setTitle('') // Reset title if none exists
        }
      } catch (error) {
        console.error('Error loading conversation title:', error)
        setTitle('') // Reset title on error
      }
    }

    loadTitle()
  }, [conversationId])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setStreaming(false)
    setLoading(false)
  }, [setStreaming, setLoading])

  const handleTitleChange = async (newTitle: string) => {
    if (!conversationId) return
    
    try {
      setIsSaving(true)
      console.log('Updating title:', { conversationId, newTitle })
      
      const response = await fetch(`/api/conversation/history?id=${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Title update failed:', { 
          status: response.status, 
          statusText: response.statusText,
          error: errorData 
        })
        throw new Error(errorData.error || 'Failed to update title')
      }

      console.log('Title updated successfully')
      setTitle(newTitle)
    } catch (error) {
      console.error('Failed to update title:', error)
      setError(error instanceof Error ? error.message : 'Failed to update title')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    // Add user message and clear input
    addMessage(userMessage)
    setCurrentMessage('')
    
    // Create placeholder for assistant message
    const assistantMessageId = crypto.randomUUID()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    addMessage(assistantMessage)

    try {
      setLoading(true)
      setStreaming(true)
      setError(undefined)

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/conversation/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          conversationId: activeConversationId // Use the active conversation ID
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      let content = ''
      let newConversationId: string | undefined

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = new TextDecoder().decode(value)
        const lines = text.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.conversationId) {
                newConversationId = parsed.conversationId
                setActiveConversationId(newConversationId) // Update the active conversation ID
              } else if (parsed.token) {
                content += parsed.token
                updateMessage(assistantMessageId, content)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setError('Message generation stopped')
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    } finally {
      setLoading(false)
      setStreaming(false)
      setIsSaving(false)
      abortControllerRef.current = null
    }
  }

  return (
    <div className="flex flex-col h-full absolute inset-0">
      {/* Fixed Header */}
      {conversationId && (
        <div className="flex-none border-b">
          <ConversationHeader 
            title={title} 
          onTitleChange={handleTitleChange}
        />
        </div>
      )}
      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="px-4">
          <div className="space-y-6 max-w-4xl mx-auto py-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation
              </div>
            )}
            {messages.filter((message) => message.role !== 'system').map((message) => (
              <div
                key={message.id || `${message.role}-${message.content.slice(0, 10)}`}
                className={cn(
                  "flex w-full",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <Card
                  className={cn(
                    "max-w-[80%] transition-all duration-200",
                    message.role === 'user' 
                      ? [
                          "bg-primary text-primary-foreground shadow-sm",
                          "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-primary after:opacity-10",
                          "hover:after:opacity-20",
                          "isolate after:-z-10"
                        ].join(" ")
                      : 'bg-card/50 hover:bg-card/80'
                  )}
                >
                  <div className="px-4 py-3">
                    {message.content ? (
                      <div className={cn(
                        "prose prose-sm max-w-none",
                        message.role === 'user' 
                          ? 'prose-invert text-primary-foreground' 
                          : 'dark:prose-invert'
                      )}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-4 w-4 animate-pulse rounded-full bg-current opacity-50" />
                        <span>Thinking...</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Fixed Footer */}
      <div className="flex-none border-t">
        {error && (
          <div className="px-4 py-2 mx-4 mt-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 backdrop-blur-sm">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || isSaving}
              className="bg-background"
            />
            {isStreaming ? (
              <Button 
                type="button" 
                variant="destructive"
                onClick={stopGeneration}
              >
                Stop
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading || isSaving}
                variant="gradient"
              >
                {isSaving ? 'Saving...' : 'Send'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
