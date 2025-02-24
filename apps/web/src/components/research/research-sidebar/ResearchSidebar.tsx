'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HistoryList } from './HistoryList'
import { ConversationList } from './ConversationList'
import { useRouter } from 'next/navigation'

export function ResearchSidebar() {
  const router = useRouter()

  return (
    <Card 
      variant="default"
      className="w-80 rounded-none border-r border-l-0 border-t-0 border-b-0 flex flex-col"
    >
      <Tabs defaultValue="research" className="flex flex-col h-full">
        <div className="flex-none px-2 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="research" className="flex-1">Research</TabsTrigger>
            <TabsTrigger value="conversations" className="flex-1">Conversations</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="research" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <nav aria-label="Research History">
              <HistoryList />
            </nav>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="conversations" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <nav aria-label="Conversation History">
              <ConversationList />
            </nav>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
} 