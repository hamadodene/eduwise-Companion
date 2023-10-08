interface SettingsStore {
    saveOpenAIConfigToMongoDB: (config: openai) => void
    saveMoodleConfigToMongoDB: (config: moodle) => void
    loadOpenAIConfigFromMongoDB: () => Promise<openai>
    loadMoodleConfigFromMongoDB: () => Promise<moodle>
}

export interface openai {
    apiKey: string
    apiHost: string
    apiOrganizationId: string
    modelTemperature: number
    modelMaxResponseTokens: number
}

export interface moodle {
    username: string
    password: string
    token: string
    moodleApiHost: number
}

async function saveOpenAIConfigToMongoDB(config: openai) {

}

async function saveMoodleConfigToMongoDB(config: moodle) {

}

async function loadOpenAIConfigFromMongoDB(): Promise<openai> {
    return
}

async function loadMoodleConfigFromMongoDB(): Promise<moodle>{
    return
}


// Implementa l'interfaccia SettingsStore
export const SettingsStore: SettingsStore = {
    saveOpenAIConfigToMongoDB,
    saveMoodleConfigToMongoDB,
    loadOpenAIConfigFromMongoDB,
    loadMoodleConfigFromMongoDB,
}

