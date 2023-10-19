import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'

export type Chat = {
  id: string
  userTitle: string
  autoTitle: string
  userId: string
  createdAt: Date
  updatedAt: Date
  courseId: string
  courseName?: string
  messages: any[]
}

type ChatHistoryContextType = {
  chatList: Chat[]
  addChat: (newChat: Chat) => void
}

const ChatContext = createContext<ChatHistoryContextType | undefined>(undefined)

export function ChatHistoryProvider({ children }) {
  const [chatList, setChatList] = useState<Chat[]>([])

  const addChat = (newChat: Chat) => {
    setChatList((prevChatList) => [newChat, ...prevChatList])
  }

  return (
    <ChatContext.Provider value={{ chatList, addChat }}>
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
