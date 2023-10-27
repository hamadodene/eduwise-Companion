'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BanIcon, Check } from "lucide-react"
import { useState } from "react"
import useChatStore, { Chat } from "@/lib/chat/store-chats"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"

interface ChatTitleDialogProps {
    chatTitle: string
    isOpen: boolean
    toogleDialog: () => void
}

export const ChatTitleDialog: React.FC<ChatTitleDialogProps> = ({ chatTitle, isOpen, toogleDialog}) => {
    const [title, setTitle] = useState(chatTitle)
    const { setUserTitle } = useLocalChatStore.getState()
    const handleTitleInputChange = event => {
        event.preventDefault()
        setTitle(event.target.value)
    }
    
    const handleConfirmButton = async (e) => {
        e.preventDefault()
        const newChat: Partial<Chat> = {
            userTitle: title
        }
        const chatId = useLocalChatStore.getState().activeChatId
        try {
            const result = await useChatStore.updateChat(newChat, chatId)
            if(result) {
                setUserTitle(chatId, result.userTitle)
                setTitle(result.userTitle)
            }
            toogleDialog()
        } catch (error) {
            
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit chat title</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input id="name" value={title} onChange={handleTitleInputChange} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex space-x-2">
                        <Button variant="ghost" onClick={toogleDialog} className="flex items-center px-4 py-2 rounded-lg">
                            <BanIcon className="mr-2" size={15} />
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmButton} className="flex items-center px-4 py-2 rounded-lg">
                            <Check className="mr-2" size={15} />
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
