import { createContext, useContext, useState } from 'react'

export type openai = {
    id?: string
    apiKey: string
    apiOrganizationId: string
    model?: string,
    userId?: string
}

export type moodle = {
    id?: string
    userId?: string
    token: string
    url: string
    username?: string
    password?: string
}

type SettingsContextType = {
    openaiCredential: openai
    moodleCredential: moodle
    addMoodleCredential: (credential: moodle) => void
    addOpenaiCredential: (credential: openai) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }) {
  const [openaiCredential, setOpenaiCredential] = useState<openai>()
  const [moodleCredential, setMoodleCredential] = useState<moodle>()

    const addMoodleCredential = (credential: moodle) => {
        setMoodleCredential(credential)
    }

    const addOpenaiCredential = (credential: openai) => {
        setOpenaiCredential(credential)
    }

  return (
    <SettingsContext.Provider value={{ moodleCredential, addMoodleCredential, openaiCredential, addOpenaiCredential }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}
