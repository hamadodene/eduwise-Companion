
type defaultRole = 'assistant' | 'system' | 'user'

export interface Chat {
  id: string
  userTitle: string
  autoTitle: string
  userId: string
  createdAt: Date
  updatedAt: Date
  courseId: string
  courseName?: string
  systemPrompt: string
  messages: any[]
}

export interface Message {
  id: string
  text: string
  sender: 'You' | 'Bot' | string
  model?: string,
  userId: string,
  typing?: boolean // Not storing on DB
  updateAt?: number
  createdAt: number
  role: defaultRole
}

export interface ChatStore {
  createChat: (courseId: string, userTitle?: string, autoTitle?: string) => Promise<Chat>
  updateChat: (chat: Partial<Chat>, chatId: string) => Promise<Chat>
  deleteChat: (chatId: string) => Promise<void>
  getChatInfo: (chatId: string) => Promise<Chat>

  addMessageToChat: (chatId: string, text: string, sender: string, role: string, userId: string) => Promise<Message>
  getMessagesForChat: (chatId: string) => Promise<Message[]>
  updateMessage: (message: Partial<Message>, messageId: String) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
}

export const useChatStore: ChatStore = {
  createChat: async (
    courseId: string
  ) => {
    try {
      const message: Partial<Chat> = {
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
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(message)
      })

      return await response.json() as Chat
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
        method: 'GET'
      })
      return await response.json()
    } catch (error) {
      console.log(error)
    }
  },
  addMessageToChat: async (chatId: string, text: string, sender: string, role: defaultRole, userId: string) => {
    const newMessage: Partial<Message> = {
      text,
      sender,
      role,
      userId
    }

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ newMessage })
      })

      return await response.json() as Message
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

      return await response.json() as Message[]
    } catch (error) {
      console.log(error)
    }
  },

  updateMessage: async (newMessage: Partial<Message>, messageId: String) => {
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(newMessage)
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
