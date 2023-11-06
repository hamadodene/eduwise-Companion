'use client'

import { SendIcon, UploadIcon } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatUploadDialog } from './ChatUploadDialog'
import { DialogContextType, useDialog } from '../context/DialogContext'

const ChatFooter = ({ chatId, courseId, userMessage, setUserMessage, handleSendMessage }) => {

    const { dialogs, openDialog, closeDialog } = useDialog() as DialogContextType

    const handleUserMessageChange = event => {
        event.preventDefault()
        setUserMessage(event.target.value)
    }

    return (
        <div className="p-4 border-t sticky">
            <div className="flex space-x-4">
                <Button
                    variant="ghost"
                    className="p-2 rounded-lg border-2 space-x-2"
                    size='sm'
                    onClick={() => openDialog(`chatUploadDialog`)}
                    >
                    <UploadIcon size={15} /> <p>Upload</p>
                </Button>
            </div>
            <div className="flex flex-col mt-4">
                <div className="flex justify-between border rounded-lg p-4 flex space-x-2 items-center">
                    <Textarea onChange={handleUserMessageChange} value={userMessage} className="p-2 rounded-md flex-grow border-none shadow-none" placeholder="Inserisci il testo"></Textarea>
                    <Button onClick={handleSendMessage} className="flex items-center rounded-md transition duration-300 self-end bg-[#5DF0D0] hover:bg-[#5DF0D0] text-black">
                        <SendIcon className="w-4 h-4 ml-1 mr-2" /> Send
                    </Button>
                </div>
            </div>
            <ChatUploadDialog
                courseId={courseId as string}
                chatId={chatId as string}
                isOpen={dialogs['chatUploadDialog']}
                toogleDialog={() => closeDialog('chatUploadDialog')}
            />
        </div>
    )
}

export default ChatFooter
