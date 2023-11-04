'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { BanIcon, Check } from "lucide-react"
import { useState } from "react"
import { useS3Upload } from "next-s3-upload"

interface ChatUploadDialogProps {
    chatId: string
    courseId: string
    isOpen: boolean
    toogleDialog: () => void
}
//Note: upload is about course not chat..upload button in chat is for confort
export const ChatUploadDialog: React.FC<ChatUploadDialogProps> = ({ chatId, courseId, isOpen, toogleDialog }) => {
    const [urls, setUrls] = useState([])
    const [files, setFiles] = useState([])
    const { uploadToS3 } = useS3Upload()

    const handleFilesUpload = async () => {
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const { url } = await uploadToS3(file, {
                endpoint: {
                    request: {
                        url: "/api/s3-upload",
                        body: {
                            courseId: courseId
                        }
                    }
                }
            })

            setUrls(current => [...current, url]);
        }
        toogleDialog()
    }

    return (
        <Dialog open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload documents</DialogTitle>
                </DialogHeader>
                <Input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                />
                <DialogFooter>
                    <div className="flex space-x-2">
                        <Button variant="ghost" onClick={toogleDialog} className="flex items-center px-4 py-2 rounded-lg">
                            <BanIcon className="mr-2" size={15} />
                            Cancel
                        </Button>
                        <Button onClick={handleFilesUpload} className="flex items-center px-4 py-2 rounded-lg">
                            <Check className="mr-2" size={15} />
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}