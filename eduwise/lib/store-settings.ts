import { useSession } from "next-auth/react"

interface SettingsStore {
    saveOpenAIConfig: (config: openai) => Promise<openai>
    saveMoodleConfig: (config: moodle) => Promise<moodle>
    loadOpenAIConfig: (userId: string) => Promise<openai>
    loadMoodleConfig: (userId: string) => Promise<moodle>
    checkOpenAiCredential: (Config: Partial<openai>) => Promise<checkResponse>
    checkMoodleCredential: (Config: Partial<moodle>) => Promise<checkResponse>
    syncMoodleData: (userId: string) => Promise<checkResponse>
    checkingOpenai: boolean
    savingOpenai: boolean
    checkingMoodle: boolean
    savingMoodle: boolean
    moodleInSync: boolean
}

export interface openai {
    id?: string
    apiKey: string
    apiOrganizationId: string
    model?: string,
    userId?: string
}

export interface moodle {
    id?: string
    userId?: string
    token: string
    url: string
    username?: string
    password?: string
}

export interface checkResponse {
    status?: string,
    success: boolean,
    message: string
}

let checkingOpenai = false
let checkingMoodle = false
let savingOpenai = false
let savingMoodle = false
let moodleInSync = false

async function checkOpenAiCredential(config: Partial<openai>): Promise<checkResponse> {
    try {
        checkingOpenai = true
        const response = await fetch('/api/openai/check', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(config)
        })

        const result = await response.json() as checkResponse
        checkingOpenai = false

        console.log("result " + JSON.stringify(result))

        return result
    } catch (error) {
        console.log(error)
        checkingOpenai = false
        return { success: false, message: "An error occured" }
    }
}

async function saveOpenAIConfig(config: openai): Promise<openai> {
    try {
        let savingOpenai = true
        const response = await fetch('/api/settings/openai', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ config })
        })

        const result = await response.json() as openai
        savingOpenai = false
        return result
    } catch (error) {
        console.log(error)
        savingOpenai = false
    }
}

async function checkMoodleCredential(config: Partial<moodle>): Promise<checkResponse> {
    try {
        checkingMoodle = true
        const response = await fetch('/api/moodle/check', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(config)
        })

        const result = await response.json() as checkResponse
        checkingMoodle = false

        return result
    } catch (error) {
        console.log(error)
        checkingMoodle = false
        return { success: false, message: "An error occured" }
    }
}

async function saveMoodleConfig(config: moodle): Promise<moodle> {
    try {
        savingMoodle = true
        const response = await fetch('/api/settings/moodle', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ config })
        })

        const result = await response.json() as moodle
        console.log("result " + JSON.stringify(result))
        savingMoodle = false
        return result
    } catch (error) {
        console.log(error)
        savingMoodle = false
    }
}

async function loadOpenAIConfig(userId: string): Promise<openai> {
    try {
        const response = await fetch(`/api/settings/openai/${userId}`, {
            method: 'GET'
        })
        return await response.json() as openai
    } catch (error) {
        console.log(error)
    }
}

async function loadMoodleConfig(userId: string): Promise<moodle> {
    try {
        const response = await fetch(`/api/settings/moodle/${userId}`, {
            method: 'GET'
        })
        return await response.json() as moodle
    } catch (error) {
        console.log(error)
    }
}


async function syncMoodleData(userId: string) {
    try {
        moodleInSync = true
        const response = await fetch(`/api/moodle/sync`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json' 
            },
            body: JSON.stringify({userId})
        })
        const result = await response.json() as checkResponse

        moodleInSync = false
        return result
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
    checkMoodleCredential,
    syncMoodleData,
    checkingOpenai,
    savingOpenai,
    checkingMoodle,
    savingMoodle,
    moodleInSync
}
