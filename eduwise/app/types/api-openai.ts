export namespace OpenAIAPI {

  // Endpoint configuration to access the API
  export interface Configuration {
    apiKey?: string
    apiHost?: string
    model?: string
    apiOrganizationId?: string
  }

  // [API] Chat
  export namespace Chat {
    export interface Message {
      role: 'assistant' | 'system' | 'user'
      content: string
    } 

    export interface CompletionsRequest {
      model: string
      messages: Message[],
      relatedDocuments?: String[],
      temperature?: number
      top_p?: number
      frequency_penalty?: number
      presence_penalty?: number
      max_tokens?: number
      stream: boolean
      n: number
    }

    export interface CompletionsResponse {
      id: string
      object: 'chat.completion'
      created: number // unix timestamp in seconds
      model: string // can differ from the ask, e.g. 'gpt-4-0314'
      choices: {
        index: number
        message: Message
        finish_reason: 'stop' | 'length' | null
      }[]
      usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
      }
    }

    export interface CompletionsResponseChunked {
      id: string
      object: 'chat.completion.chunk'
      created: number
      model: string
      choices: {
        index: number
        delta: Partial<Message>
        finish_reason: 'stop' | 'length' | null
      }[]
    }
  }
}