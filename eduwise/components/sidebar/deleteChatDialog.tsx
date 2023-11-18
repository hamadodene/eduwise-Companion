'use client'
import React from "react"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import useChatStore, { Chat } from "@/lib/chat/store-chats"
import { Button } from "../ui/button"
import { BanIcon, Check } from "lucide-react"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { toast } from "../ui/use-toast"
import { useRouter } from "next/navigation"

interface DeleteChatsDialogProps {
    chat: Chat
    isOpen: boolean
    toogleDialog: () => void
}

const DeleteChatDialog: React.FC<DeleteChatsDialogProps> = ({ chat, isOpen, toogleDialog }) => {
    const { deleteChat, activeChatId, setActiveChatId } = useLocalChatStore.getState()
    const router = useRouter()

    const handleConfirmButton = async (e) => {
        e.preventDefault()
        if (chat.id !== null) {
            try {
                await useChatStore.deleteChat(chat.id)
                deleteChat(chat.id)
                toast({
                    title: "Chat deleted successfully"
                })
                router.push("/")
            } catch (error) {
                console.log(error)
                toast({
                    title: "Error occured during chat deletion"
                })
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent className="md:max-w-[600px] rounded-lg">
                <DialogHeader className="border-b">
                    <DialogTitle className="mb-4">Delete chat?</DialogTitle>
                </DialogHeader>
                The chat with title "{chat.userTitle || chat.autoTitle}" will be deleted
                <DialogFooter>
                    <div className="flex space-x-2">
                        <Button variant="ghost" onClick={toogleDialog} className="flex items-center px-4 py-2 rounded-lg">
                            <BanIcon className="mr-2" size={15} />
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmButton} className="flex items-center px-4 py-2 rounded-lg">
                            <Check className="mr-2" size={15} />
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteChatDialog