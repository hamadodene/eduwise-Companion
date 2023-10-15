import { ApiChatInput, ApiChatResponse } from '@/app/api/openai/chat/chat';
import { Message, useChatStore } from '@/lib/store-chats';
import { fastChatModelId } from './data';
import { useSettingsStore } from '@/lib/store-settings';


/**
 * Main function to send the chat to the assistant and receive a response (streaming)
 */
export async function streamAssistantMessage(
  chatId: string, assistantMessageId: string, history: Message[],
  apiKey: string | undefined, apiHost: string | undefined, apiOrganizationId: string | undefined,
  chatModelId: string, modelTemperature: number, modelMaxResponseTokens: number,
  onFirstParagraph?: (firstParagraph: string) => void,
) {

  const payload: ApiChatInput = {
    api: {
      ...(apiKey && { apiKey }),
      ...(apiHost && { apiHost }),
      ...(apiOrganizationId && { apiOrganizationId }),
    },
    model: chatModelId,
    messages: history.map(({ role, text }) => ({
      role: role,
      content: text,
    })),
    temperature: modelTemperature,
    max_tokens: modelMaxResponseTokens,
  };

  try {

    const response = await fetch('/api/openai/stream-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // loop forever until the read is done, or the abort controller is triggered
      let incrementalText = '';
      let parsedFirstPacket = false;
      let sentFirstParagraph = false;
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        incrementalText += decoder.decode(value, { stream: true });

        // there may be a JSON object at the beginning of the message, which contains the model name (streaming workaround)
        if (!parsedFirstPacket && incrementalText.startsWith('{')) {
          const endOfJson = incrementalText.indexOf('}');
          if (endOfJson > 0) {
            const json = incrementalText.substring(0, endOfJson + 1);
            incrementalText = incrementalText.substring(endOfJson + 1);
            try {
              const parsed = JSON.parse(json);
              await useChatStore.updateMessage({ model: parsed.model }, chatId)
              parsedFirstPacket = true;
            } catch (e) {
              // error parsing JSON, ignore
              console.log('Error parsing JSON: ' + e);
            }
          }
        }

        // if the first paragraph (after the first packet) is complete, call the callback
        if (parsedFirstPacket && onFirstParagraph && !sentFirstParagraph) {
          let cutPoint = incrementalText.lastIndexOf('\n');
          if (cutPoint < 0)
            cutPoint = incrementalText.lastIndexOf('. ');
          if (cutPoint > 100 && cutPoint < 400) {
            const firstParagraph = incrementalText.substring(0, cutPoint);
            onFirstParagraph(firstParagraph);
            sentFirstParagraph = true;
          }
        }
        await useChatStore.updateMessage({ text: incrementalText }, assistantMessageId)
      }
    }

  } catch (error: any) {
    console.error('Fetch request error:', error);
  }

  // finally, stop the typing animation
  await useChatStore.updateMessage({ typing: false }, assistantMessageId)
}

/**
 * Creates the AI titles for conversations, by taking the last 5 first-lines and asking AI what's that about
 */
export async function updateAutoConversationTitle(chatId: string, userId: string) {

  const chat = await useChatStore.getChatInfo(chatId)

  if (!chat || chat.autoTitle || chat.userTitle) return;

  const messages = await useChatStore.getMessagesForChat(chatId)

  // first line of the last 5 messages
  const historyLines: string[] = messages.slice(-5).filter(m => m.role !== 'system').map(m => {
    let text = m.text.split('\n')[0];
    text = text.length > 50 ? text.substring(0, 50) + '...' : text;
    text = `${m.role === 'user' ? 'You' : 'Assistant'}: ${text}`;
    return `- ${text}`;
  });

  const openAiInfo = await useSettingsStore.loadOpenAIConfig(userId)

  // We try first use user key, otherwise we use default key
  const apiKey =  (openAiInfo.apiKey || process.env.OPENAI_API_KEY || '').trim()
  const apiHost =  (process.env.OPENAI_API_HOST || 'api.openai.com').trim().replaceAll('https://', '')
  const apiOrganizationId =  (openAiInfo.apiOrganizationId || process.env.OPENAI_API_ORG_ID || '').trim()

  const payload: ApiChatInput = {
    api: {
      ...(apiKey && { apiKey }),
      ...(apiHost && { apiHost }),
      ...(apiOrganizationId && { apiOrganizationId }),
    },
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
  };

  try {
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const chatResponse: ApiChatResponse = await response.json();
      const title = chatResponse.message?.content?.trim()
        ?.replaceAll('"', '')
        ?.replace('Title: ', '')
        ?.replace('title: ', '');
      if (title)
        await useChatStore.updateChat({ autoTitle: title}, chatId)
    }
  } catch (error: any) {
    console.error('updateAutoConversationTitle: fetch request error:', error);
  }
}

