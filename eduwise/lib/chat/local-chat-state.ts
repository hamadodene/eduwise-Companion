import { persist, createJSONStorage } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'
import { Chat, Message } from './store-chats'
import { createWithEqualityFn } from 'zustand/traditional'
import { suggestions } from '../courses'
export { createWithEqualityFn } from 'zustand/traditional'


export interface ChatStore {
  chats: Chat[]
  activeChatId: string | null

  // store setters
  createChat: (newChat: Chat) => void
  deleteChat: (chatId: string) => void
  setActiveChatId: (chatId: string) => void

  // within a conversation
  setMessages: (chatId: string, messages: Message[]) => void
  appendMessage: (chatId: string, message: Message) => void
  deleteMessage: (chatId: string, messageId: string) => void
  editMessage: (chatId: string, messageId: string, updatedMessage: Partial<Message>, touch: boolean) => void
  setAutoTitle: (chatId: string, autoTitle: string) => void
  setUserTitle: (chatId: string, userTitle: string) => void
  setSuggestion: (chatId: string, suggestions: suggestions[]) => void
  // utility function
  _editChat: (chatId: string, update: Partial<Chat> | ((conversation: Chat) => Partial<Chat>)) => void
}


export const useLocalChatStore = createWithEqualityFn<ChatStore>()(
  persist(
    (set, get) => ({
      // default state
      //For now we have not a default chat
      chats: [],
      activeChatId: "",

      createChat: (newChat: Chat) =>
        set((state) => {
          const chat = {
            id: newChat.id,
            messages: newChat.messages || [],
            systemPrompt: newChat.systemPrompt,
            chatModelId: newChat,
            createdAt: newChat.createdAt,
            updatedAt: newChat.updatedAt,
            courseId: newChat.courseId,
            userId: newChat.userId,
            userTitle: newChat.userTitle,
            autoTitle: newChat.autoTitle,
            courseName: newChat.courseName,
            suggestions: []
          }
          return {
            chats: [chat, ...state.chats],
            activeChatId: chat.id,
          };
        }),

      deleteChat: (chatId: string) =>
        set(state => {
          const cIndex = state.chats.findIndex((chat: Chat): boolean => chat.id === chatId)
          // remove from the list
          const chats = state.chats.filter((chat: Chat): boolean => chat.id !== chatId)
          
          return {
            chats,
          }
        }),

      setActiveChatId: (chatId: string) =>
        set({ activeChatId: chatId }),

      setMessages: (chatId: string, newMessages: Message[]) =>
        get()._editChat(chatId, chat => {
          return {
            messages: newMessages
          }
        }),

      appendMessage: (chatId: string, message: Message) =>
        get()._editChat(chatId, conversation => {
          const messages = [...conversation.messages, message]
          return {
            messages
          }
        }),

      deleteMessage: (chatId: string, messageId: string) =>
        get()._editChat(chatId, chat => {

          const messages = chat.messages.filter(message => message.id !== messageId)

          return {
            messages
          }
        }),

      editMessage: (chatId: string, messageId: string, updatedMessage: Partial<Message>) =>
        get()._editChat(chatId, chat => {

          const messages = chat.messages.map((message: Message): Message =>
            message.id === messageId
              ? {
                ...message,
                ...updatedMessage
              }
              : message)

          return {
            messages
          }
        }),

      setAutoTitle: (chatId: string, autoTitle: string) =>
        get()._editChat(chatId,
          {
            autoTitle,
          }),

      setUserTitle: (chatId: string, userTitle: string) =>
        get()._editChat(chatId,
          {
            userTitle,
          }),

      setSuggestion: (chatId: string, suggestions: []) =>
        get()._editChat(chatId,
          {
            suggestions,
          }),

      _editChat: (chatId: string, update: Partial<Chat> | ((conversation: Chat) => Partial<Chat>)) =>
        set(state => ({
          chats: state.chats.map((chat: Chat): Chat =>
            chat.id === chatId
              ? {
                ...chat,
                ...(typeof update === 'function' ? update(chat) : update),
              }
              : chat),
        })),

    }),
    {
      name: 'eduwise-local-chat-state',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // if nothing is selected, select the first conversation
          if (!state.activeChatId && state.chats.length)
            state.activeChatId = state.chats[0].id
        }
      },
      storage: createJSONStorage(() => sessionStorage),
    })
)


export const useChatIDs = (): string[] =>
  useLocalChatStore(
    state => state.chats.map(chat => chat.id),
    shallow,
  )
