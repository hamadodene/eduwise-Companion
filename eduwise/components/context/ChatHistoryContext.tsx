import { createContext, useContext, useState } from 'react'

type defaultRole = 'assistant' | 'system' | 'user'

export type Chat = {
  id: string
  userTitle: string
  autoTitle: string
  userId: string
  createdAt: Date
  updatedAt: Date
  courseId: string
  courseName?: string
  messages: Message[]
}

export type Message = {
  id: string
  text: string
  sender: 'You' | 'Bot' | string
  typing?: boolean
  updateAt?: number
  createAt: number
  model: string
  role: defaultRole
}

type ChatHistoryContextType = {
  chatList: Chat[]
  addChat: (newChat: Chat) => void
  activeChat: Chat | null
  setActiveChat: (chat: Chat) => void
  addMessage: (message: Partial<Message>) => void
  currentPage: string
  setCurrentPage: (chatId: string) => void
  updateMessage: (messageId: string, updatedInfo: Partial<Message>) => void
}

const ChatContext = createContext<ChatHistoryContextType | undefined>(undefined)

export function ChatHistoryProvider({ children }) {
  const [chatList, setChatList] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [currentPage, setCurrentPage] = useState('')

  const addChat = (newChat: Chat) => {
    setChatList((prevChatList) => [newChat, ...prevChatList])
  }

  const addMessage = (message: Message) => {
    if (activeChat) {
      setActiveChat((prevChat) => {
        const updatedMessages = Array.isArray(prevChat.messages) ? [...prevChat.messages, message] : [message]
        return {
          ...prevChat,
          messages: updatedMessages,
        }
      })
    }
  }


  const updateMessage = (messageId, updatedInfo) => {
    if (activeChat) {
      setActiveChat((prevChat) => {
        if (prevChat) {
          const updatedMessages = prevChat.messages.map((message) => {
            if (message.id === messageId) {
              return { ...message, ...updatedInfo }
            }
            return message
          })

          return {
            ...prevChat,
            messages: updatedMessages,
          }
        }
        return prevChat
      })
    }
  }


  return (
    <ChatContext.Provider value={{ chatList, addChat, activeChat, setActiveChat, addMessage, updateMessage, currentPage, setCurrentPage }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
