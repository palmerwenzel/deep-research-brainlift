import { type ConversationState, type ConversationAction } from '../types/state'

export const initialState: ConversationState = {
  isLoading: false,
  currentMessage: '',
  messages: [],
  isStreaming: false
}

export function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload }
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        currentMessage: '' // Clear input after adding message
      }
    
    case 'UPDATE_MESSAGE': {
      const { id, content } = action.payload
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === id ? { ...msg, content } : msg
        )
      }
    }
    
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload }
    
    case 'SET_ABORT_CONTROLLER':
      return { ...state, abortController: action.payload }
    
    case 'SET_CURRENT_MESSAGE':
      return { ...state, currentMessage: action.payload }
    
    case 'CLEAR_CONVERSATION':
      return {
        ...initialState,
        abortController: state.abortController
      }
    
    default:
      return state
  }
}

export class ConversationManager {
  private state: ConversationState
  private dispatch: (action: ConversationAction) => void

  constructor(
    initialState: ConversationState,
    dispatch: (action: ConversationAction) => void
  ) {
    this.state = initialState
    this.dispatch = dispatch
  }

  public getState(): ConversationState {
    return this.state
  }

  public async addMessage(content: string, role: 'user' | 'assistant'): Promise<void> {
    const message = {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: new Date()
    }
    
    this.dispatch({ type: 'ADD_MESSAGE', payload: message })
  }

  public updateMessage(id: string, content: string): void {
    this.dispatch({
      type: 'UPDATE_MESSAGE',
      payload: { id, content }
    })
  }

  public setStreaming(isStreaming: boolean): void {
    this.dispatch({ type: 'SET_STREAMING', payload: isStreaming })
  }

  public setAbortController(controller?: AbortController): void {
    this.dispatch({
      type: 'SET_ABORT_CONTROLLER',
      payload: controller
    })
  }

  public clearConversation(): void {
    this.dispatch({ type: 'CLEAR_CONVERSATION' })
  }

  public setError(error?: string): void {
    this.dispatch({ type: 'SET_ERROR', payload: error })
  }

  public setCurrentMessage(message: string): void {
    this.dispatch({
      type: 'SET_CURRENT_MESSAGE',
      payload: message
    })
  }
} 