import { create } from 'zustand'
import type { Message } from '@brainlift/conversation'

interface ConversationState {
  messages: Message[]
  isLoading: boolean
  error?: string
  currentMessage: string
  isStreaming: boolean
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, content: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error?: string) => void
  setCurrentMessage: (message: string) => void
  setStreaming: (isStreaming: boolean) => void
  clearConversation: () => void
}

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  isLoading: false,
  currentMessage: '',
  isStreaming: false,

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
    currentMessage: ''
  })),
  
  updateMessage: (id, content) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === id ? { ...msg, content } : msg
    )
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setCurrentMessage: (currentMessage) => set({ currentMessage }),
  
  setStreaming: (isStreaming) => set({ isStreaming }),
  
  clearConversation: () => set({
    messages: [],
    currentMessage: '',
    error: undefined
  })
})) 