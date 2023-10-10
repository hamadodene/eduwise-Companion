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
    modelTemperature: number
    modelMaxResponseTokens: number
}

export interface moodle {
    token: string
    moodleApiHost: number
}

async function saveOpenAIConfig(config: openai) {

}

async function saveMoodleConfig(config: moodle) {

}

async function loadOpenAIConfig(userId: string): Promise<openai> {
    try {
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

async function loadMoodleConfig(userId: string): Promise<moodle> {
    try {
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

