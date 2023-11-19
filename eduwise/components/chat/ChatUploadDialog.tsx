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
import { BanIcon, Check, SeparatorHorizontal } from "lucide-react"
import { useState } from "react"
import { useS3Upload } from "next-s3-upload"
import { addDocument } from "@/lib/courses"
import { Separator } from "../ui/separator"
import { useCourseContext } from "../context/CourseContext"

interface ChatUploadDialogProps {
    chatId: string
    courseId: string
    isOpen: boolean
    toogleDialog: () => void
}
//Note: upload is about course not chat..upload button in chat is for confort
export const ChatUploadDialog: React.FC<ChatUploadDialogProps> = ({ chatId, courseId, isOpen, toogleDialog }) => {
    const [urls, setUrls] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const { uploadToS3 } = useS3Upload()
    const {resetCourseList} = useCourseContext()

    const handleFilesUpload = async () => {
        try {
            for (let index = 0; index < files.length; index++) {
                const file = files[index]
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
                setUrls(current => [...current, url])
                await addDocument(courseId, file.name, url)
                resetCourseList()
            }
            toogleDialog()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload documents</DialogTitle>
                </DialogHeader>
                <Separator/>
                <Input
                    type="file"
                    multiple
                    accept="application/pdf"
                    className="mt-2 mb-2 h-10"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const selectedFiles = e.target.files;
                        if (selectedFiles) {
                            const filesArray: File[] = Array.from(selectedFiles);
                            setFiles(filesArray);
                        }
                    }} />
                <Separator/>
                <DialogFooter>
                    <div className="flex space-x-2">
                        <Button variant="ghost" onClick={toogleDialog} className="flex items-center px-4 py-2 rounded-lg">
                            <BanIcon className="mr-2" size={15} />
                            Cancel
                        </Button>
                        <Button variant="ghost" onClick={handleFilesUpload} className="flex items-center px-4 py-2 rounded-lg">
                            <Check className="mr-2" size={15} />
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}