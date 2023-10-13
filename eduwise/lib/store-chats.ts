import { useSession } from "next-auth/react"

type defaultRole = 'assistant' | 'system' | 'user';

export interface Chat {
  userTitle?: string
  autoTitle?: string
  courseId: string
}

export interface Message {
  text: string
  sender: 'You' | 'Bot' | string
  model?: string,
  typing?: boolean
  updateAt?: number
  createAt: number
  role: defaultRole
}

export interface ChatStore {
  createChat: (courseId: string, userTitle?: string, autoTitle?: string) => Promise<Chat>
  updateChat: (chat: Partial<Chat>, chatId: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  getChatInfo: (chatId: string) => Promise<Chat>

  addMessageToChat: (chatId: string, text: string, sender: string, role: string) => Promise<Message>
  getMessagesForChat: (chatId: string) => Promise<Message[]>
  updateMessage: (message: Partial<Message>, messageId: String) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
}

// Implementazione di ChatStore (puoi usare MongoDB o un altro database)
export const useChatStore: ChatStore = {
  createChat: async (
    courseId: string
  ) => {
    try {
      const message: Chat = {
        courseId
      }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ message })
      })

      return await response.json() as Chat
    } catch (error) {
      console.log(error)
    }
  },

  updateChat: async (newChat: Partial<Chat>, chatId: String) => {
    try {
      const message: Partial<Chat> = newChat

      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'UPDATE',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ message })
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },
  getChatInfo: async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/info/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })
      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },
  addMessageToChat: async (chatId: string, text: string, sender: string, role: defaultRole) => {
    const newMessage: Message = {
      text,
      createAt: Date.now(),
      sender,
      role
    }

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ newMessage })
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },

  getMessagesForChat: async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },

  updateMessage: async (newMessage: Partial<Message>, messageId: String) => {
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ newMessage })
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      })

      return await response.json()
    } catch (error) {
      console.log(error)
    }
  }
}

export default useChatStore
