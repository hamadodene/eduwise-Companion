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
import { Chat } from "@/lib/chat/store-chats"
import { BanIcon, Check } from "lucide-react"
import { useState } from "react"

interface ChatTitleDialogProps {
    chat?: Chat
    isOpen: boolean
    toogleDialog: () => void
}

export const ChatTitleDialog: React.FC<ChatTitleDialogProps> = ({ isOpen, toogleDialog}) => {
    const [title, setTitle] = useState('New conversation')

    const handleTitleInputChange = event => {
        event.preventDefault()
        setTitle(event.target.value)
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
                        <Button variant="ghost" className="flex items-center px-4 py-2 rounded-lg">
                            <BanIcon className="mr-2" size={15} />
                            Cancel
                        </Button>
                        <Button className="flex items-center px-4 py-2 rounded-lg">
                            <Check className="mr-2" size={15} />
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
