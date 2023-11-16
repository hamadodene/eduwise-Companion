'use client'

import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { getSuggestions } from "@/lib/openai/ai"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Icons } from "../icons"


const ChatSuggestions = (props: { chatId: string, openaiCredential }) => {
    const { data: session } = useSession({
        required: true
    })
    const [status, setStatus] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("We are analyzing your conversation to generate the best suggestions for you.");

    const { chats } = useLocalChatStore.getState();
    const chat = chats.find(c => c.id === props.chatId)

    const suggestions = useCallback(async () => {
        if (session) {
            setStatus(true)
            await getSuggestions(props.chatId, session.user.id, props.openaiCredential)
            setStatus(false)
        }
    }, [session])

    useEffect(() => {
        suggestions()
    }, [session, suggestions])


    return (
        <div className={` flex flex-col h-screen
        ${status ? 'items-center justify-center mt-10' : 'items-left justify-left'}
        `} >
            {status && (
                <div className="flex flex-col items-center justify-center">
                    <div>
                        <Icons.animeted_spinner className=""/>
                    </div>
                    <div>
                        <p className="ml-2">{loadingMessage}</p>
                    </div>
                </div>
            )}

            <div className="h-full overflow-y-auto no-scrollbar mt-4">
                <Accordion type="single" defaultValue="0" collapsible>
                    {
                        chat.suggestions.map((suggestion, index) => (
                            <AccordionItem key={index} value={index.toString()}>
                                <AccordionTrigger><p className="text-left">{suggestion.title}</p></AccordionTrigger>
                                <AccordionContent>
                                    <div className="bg-[#12b886] p-4 rounded-md shadow-md text-white">
                                        <div className="mb-2">
                                            <strong>Content:</strong> {suggestion.content}
                                        </div>

                                        <div className="mb-2">
                                            <strong>Difficulty Level:</strong> {suggestion.difficulty_level}
                                        </div>

                                        <div className="mb-2">
                                            <strong>Priority:</strong> {suggestion.priority}
                                        </div>

                                        <div>
                                            <strong>Importance:</strong> {suggestion.importance}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                </Accordion>
            </div>
        </div>
    )
}

export default ChatSuggestions