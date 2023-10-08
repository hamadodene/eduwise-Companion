import { v4 as uuidv4 } from 'uuid'

type defaultRole =  'assistant' | 'system' | 'user';

export interface Chat {
  userTitle?: string
  autoTitle?: string
  courseId: string
}

export interface Message {
  chatId: string
  text: string
  timestamp: number
  sender: 'You' | 'Bot' | string
  role: defaultRole
}

export interface ChatStore {
  createChat: (courseId: string, userTitle?: string, autoTitle?: string) => Promise<Chat>
  updateChat: (chat: Chat) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>

  addMessageToChat: (chatId: string, text: string, sender: string, role: string) => Promise<Message>
  getMessagesForChat: (chatId: string) => Promise<Message[]>
  updateMessage: (message: Message) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
}

// Implementazione di ChatStore (puoi usare MongoDB o un altro database)
const chatStore: ChatStore = {
  createChat: async (
    courseId: string
    ) => {
    const newChat: Chat = {
      courseId
    }

    // Save info to mongodb
    // make api request to backend

    return newChat
  },

  updateChat: async (chat: Chat) => {

  },

  deleteChat: async (chatId: string) => {

  },

  addMessageToChat: async (chatId: string, text: string, sender: string, role: defaultRole) => {
    const newMessage: Message = {
      chatId,
      text,
      timestamp: Date.now(),
      sender,
      role
    }

    // save message to DB
    // make api requesti to backend

    return newMessage
  },

  getMessagesForChat: async (chatId: string) => {


    return [] 
  },

  updateMessage: async (message: Message) => {

  },

  deleteMessage: async (messageId: string) => {

  }
}

export default chatStore
