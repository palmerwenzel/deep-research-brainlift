import { type Message, type Conversation } from './message'

export interface ConversationState {
  isLoading: boolean
  error?: string
  currentMessage: string
  messages: Message[]
  isStreaming: boolean
  abortController?: AbortController
}

export interface ConversationStore {
  conversations: Map<string, Conversation>
  activeConversationId?: string
  isLoading: boolean
  error?: string
}

export type ConversationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload?: string }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ABORT_CONTROLLER'; payload?: AbortController }
  | { type: 'SET_CURRENT_MESSAGE'; payload: string }
  | { type: 'CLEAR_CONVERSATION' }

export type ConversationDispatch = (action: ConversationAction) => void

export interface ConversationContextType {
  state: ConversationState
  dispatch: ConversationDispatch
  sendMessage: (content: string) => Promise<void>
  stopGeneration: () => void
} 