import { useSession } from "next-auth/react"

interface SettingsStore {
    saveOpenAIConfig: (config: openai) => Promise<openai>
    saveMoodleConfig: (config: moodle) => void
    loadOpenAIConfig: (userId: string) => Promise<openai>
    loadMoodleConfig: (userId: string) => Promise<moodle>
    checkOpenAiCredential: (Config: Partial<openai>) => Promise<checkResponse>
    checking: boolean
}

export interface openai {
    id?: string
    apiKey: string
    apiOrganizationId: string
    model?: string,
    userId?: string
}

export interface moodle {
    token: string
    moodleApiHost: string
}

export interface checkResponse {
    status?: string,
    success: boolean,
    message: string
}

let checking = false

async function checkOpenAiCredential(config: Partial<openai>): Promise<checkResponse> {
    try {
        checking = true
        console.log("client " + config.apiKey)
        console.log(" client " + config.apiOrganizationId)
        const response = await fetch('/api/openai/check', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(config)
        })

        const result = await response.json() as checkResponse
        checking = false

        return result
    } catch (error) {
        console.log(error)
        checking = false
        return { success: false, message: "An error occured" }
    }
}

async function saveOpenAIConfig(config: openai): Promise<openai> {
    try {
        console.log("config " + JSON.stringify(config))
        const response = await fetch('/api/settings/openai', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ config })
        })

        return await response.json() as openai
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
    checkOpenAiCredential,
    checking
}

