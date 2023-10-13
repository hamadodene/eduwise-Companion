import { useSession } from "next-auth/react"

interface SettingsStore {
    saveOpenAIConfig: (config: openai) => void
    saveMoodleConfig: (config: moodle) => void
    loadOpenAIConfig: (userId: string) => Promise<openai>
    loadMoodleConfig: (userId: string) => Promise<moodle>
}

export interface openai {
    apiKey: string
    apiHost: string
    apiOrganizationId: string
}

export interface moodle {
    token: string
    moodleApiHost: string
}

async function saveOpenAIConfig(config: openai) {
    try {
        const response = await fetch('/api/settings/openai', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ config })
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

async function saveMoodleConfig(config: moodle) {
    try {
        const response = await fetch('/api/settings/moodle', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ config })
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

async function loadOpenAIConfig(): Promise<openai> {
    try {
        const { data: session } = useSession()
        const userId = session.user.id

        const response = await fetch('/api/settings/openai/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userId)
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

async function loadMoodleConfig(): Promise<moodle> {
    try {
        const { data: session } = useSession()
        const userId = session.user.id

        const response = await fetch('/api/settings/moodle/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userId)
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}


// Implementa l'interfaccia SettingsStore
export const useSettingsStore: SettingsStore = {
    saveOpenAIConfig,
    saveMoodleConfig,
    loadOpenAIConfig,
    loadMoodleConfig,
}

