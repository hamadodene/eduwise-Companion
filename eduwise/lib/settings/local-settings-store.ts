import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


/// Settings Store

interface SettingsStore {
    // OpenAI API settings
    apiKey: string
    setApiKey: (apiKey: string) => void

    gptModel: string
    setGtpModel: (model: string) => void

    apiOrganizationId: string
    setApiOrganizationId: (apiOrganizationId: string) => void

    // Moodle API settings
    moodleToken: string
    setMoodleToken: (moodleToken: string) => void

    moodleEndpoint: string
    setMoodleEndpoint: (moodleEndpoint: string) => void
}

export const useLocalSettingsStore = create<SettingsStore>()(
    persist(
    (set) => ({

        // OpenAI API settings
        apiKey: (function () {
            if (typeof localStorage === 'undefined') return ''
            return localStorage.getItem('eduwise-settings-openai-api-key') || ''
        })(),
        setApiKey: (apiKey: string) => set({ apiKey }),

        gptModel: '',
        setGtpModel: (gptModel: string) => set({ gptModel }),

        apiOrganizationId: '',
        setApiOrganizationId: (apiOrganizationId: string) => set({ apiOrganizationId }),

        // Moodle api settings
        moodleToken: (function () {
            if (typeof localStorage === 'undefined') return ''
            return localStorage.getItem('eduwise-settings-moodle-token') || ''
        })(),
        setMoodleToken: (moodleToken: string) => set({ moodleToken }),

        moodleEndpoint: '',
        setMoodleEndpoint: (moodleEndpoint: string) => set({ moodleEndpoint })

    }),

    {
        name: 'eduwise-local-settings-state',
        storage: createJSONStorage(() => sessionStorage),
      })
)
