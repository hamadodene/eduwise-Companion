import { ApiChatInput, ApiChatResponse } from '@/app/api/openai/chat/route'
import { Message, useChatStore } from '@/lib/chat/store-chats'
import { fastChatModelId } from './data'
import { openai } from '../settings/store-settings'
import { useLocalChatStore } from '@/lib/chat/local-chat-state'
import { generateSuggestionPrompt } from '../prompts'
import { suggestions } from '../courses'
/**
 * Main function to send the chat to the assistant and receive a response (streaming)
 */
export async function streamAssistantMessage(
  chatId: string, assistantMessageId: string, history: Message[], openaiCredential: openai, userId,
  onFirstParagraph?: (firstParagraph: string) => void
) {

  // We try first use user key, otherwise we use default key
  const apiKey = (openaiCredential.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '').trim()
  const apiHost = (process.env.NEXT_PUBLIC_OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', '')
  const apiOrganizationId = (openaiCredential.apiOrganizationId || process.env.NEXT_PUBLIC_OPENAI_API_ORG_ID || '').trim()
  const chatModelId = (openaiCredential.model || process.env.OPENAI_DEFAULT_MODEL || '').trim()
  const { editMessage } = useLocalChatStore.getState();

  const payload: ApiChatInput = {
    api: {
      ...(apiKey && { apiKey }),
      ...(apiOrganizationId && { apiOrganizationId }),
    },
    model: chatModelId,
    userId: userId,
    messages: history.map(({ role, text }) => ({
      role: role,
      content: text,
    }))
  }

  try {
    const response = await fetch('/api/openai/stream-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      // loop forever until the read is done, or the abort controller is triggered
      let incrementalText = ''
      let parsedFirstPacket = false
      let sentFirstParagraph = false
      let model = ""
      while (true) {
        const { value, done } = await reader.read()

        if (done) break

        incrementalText += decoder.decode(value, { stream: true })

        // there may be a JSON object at the beginning of the message, which contains the model name (streaming workaround)
        if (!parsedFirstPacket && incrementalText.startsWith('{')) {
          const endOfJson = incrementalText.indexOf('}')
          if (endOfJson > 0) {
            const json = incrementalText.substring(0, endOfJson + 1)
            incrementalText = incrementalText.substring(endOfJson + 1)
            try {
              const parsed = JSON.parse(json)
              model = parsed.model
              editMessage(chatId, assistantMessageId, { model: parsed.model }, false)
              parsedFirstPacket = true
            } catch (e) {
              // error parsing JSON, ignore
              console.log('Error parsing JSON: ' + e)
            }
          }
        }

        // if the first paragraph (after the first packet) is complete, call the callback
        if (parsedFirstPacket && onFirstParagraph && !sentFirstParagraph) {
          let cutPoint = incrementalText.lastIndexOf('\n')
          if (cutPoint < 0)
            cutPoint = incrementalText.lastIndexOf('. ')
          if (cutPoint > 100 && cutPoint < 400) {
            const firstParagraph = incrementalText.substring(0, cutPoint)
            onFirstParagraph(firstParagraph)
            sentFirstParagraph = true
          }
        }
        editMessage(chatId, assistantMessageId, { text: incrementalText }, false)
      }
      // persist on db
      await useChatStore.updateMessage({ text: incrementalText, model: model }, assistantMessageId)
    }
  } catch (error: any) {
    console.error('Fetch request error:', error)
  }

  // Set typing false, but not need to store it on DB
  editMessage(chatId, assistantMessageId, { typing: false }, false)
}

/**
 * Creates the AI titles for conversations, by taking the last 5 first-lines and asking AI what's that about
 */
export async function updateAutoConversationTitle(chatId: string, userId: string, openaiCredential) {
  // external state
  const { chats, setAutoTitle } = useLocalChatStore.getState();

  // only operate on valid conversations, without any title
  const chat = chats.find(c => c.id === chatId) ?? null;
  if (!chat || chat.autoTitle || chat.userTitle) return;

  // first line of the last 5 messages
  const historyLines: string[] = chat.messages.slice(-5).filter(m => m.role !== 'system').map(m => {
    let text = m.text.split('\n')[0]
    text = text.length > 50 ? text.substring(0, 50) + '...' : text
    text = `${m.role === 'user' ? 'You' : 'Assistant'}: ${text}`
    return `- ${text}`
  })


  // We try first use user key, otherwise we use default key
  const apiKey = (openaiCredential.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '').trim()
  const apiHost = (process.env.NEXT_PUBLIC_OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', '')
  const apiOrganizationId = (openaiCredential.apiOrganizationId || process.env.NEXT_PUBLIC_OPENAI_API_ORG_ID || '').trim()

  const payload: ApiChatInput = {
    api: {
      ...(apiKey && { apiKey }),
      ...(apiHost && { apiHost }),
      ...(apiOrganizationId && { apiOrganizationId }),
    },
    userId: userId,
    model: fastChatModelId,
    messages: [
      { role: 'system', content: `You are an AI language expert who specializes in creating very concise and short chat titles.` },
      {
        role: 'user', content:
          'Analyze the given list of pre-processed first lines from each participant\'s conversation and generate a concise chat ' +
          'title that represents the content and tone of the conversation. Only respond with the lowercase short title and nothing else.\n' +
          '\n' +
          historyLines.join('\n') +
          '\n',
      },
    ],
  }

  try {
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      const chatResponse: ApiChatResponse = await response.json()
      const title = chatResponse.message?.content?.trim()
        ?.replaceAll('"', '')
        ?.replace('Title: ', '')
        ?.replace('title: ', '')
      if (title) {
        //Persist title
        await useChatStore.updateChat({ autoTitle: title }, chatId)
        //Set locally
        setAutoTitle(chatId, title)
      }
    }
  } catch (error: any) {
    console.error('updateAutoConversationTitle: fetch request error:', error)
  }
}

export async function getSuggestions(chatId: string, userId: string, openaiCredential) {
  // external state
  const { setSuggestion, chats } = useLocalChatStore.getState()

  // only operate on valid conversations, without any title
  const chat = chats.find(c => c.id === chatId) ?? null
  if (!chat || chat.suggestions.length !== 0) {
    return
  } 

  // first line of the last 5 messages
  const historyLines: string[] = chat.messages.slice(-10).map(m => {
    const text = `${m.role === 'user' ? 'You' : 'Assistant'}: ${m.text}`;
    return `- ${text}`;
  });

  // We try first use user key, otherwise we use default key
  const apiKey = (openaiCredential.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '').trim()
  const apiHost = (process.env.OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', '')
  const apiOrganizationId = (openaiCredential.apiOrganizationId || process.env.NEXT_PUBLIC_OPENAI_API_ORG_ID || '').trim()

  const payload: ApiChatInput = {
    api: {
      ...(apiKey && { apiKey }),
      ...(apiHost && { apiHost }),
      ...(apiOrganizationId && { apiOrganizationId }),
    },
    userId: userId,
    model: fastChatModelId,
    messages: [
      { role: 'system', content: `You are an AI language expert capable of generating suggestions that can help students improve their skills or fill in their gaps.` },
      {
        role: 'user', content:
          generateSuggestionPrompt(chat.courseName) +
          '\n' +
          historyLines.join('\n') +
          '\n',
      },
    ],
  }

  try {
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      const chatResponse: ApiChatResponse = await response.json()
      const resp: suggestions[] = JSON.parse(chatResponse.message.content) 
      setSuggestion(chatId, resp)
    }
  } catch (error: any) {
    console.error('updateAutoConversationTitle: fetch request error:', error)
  }
}