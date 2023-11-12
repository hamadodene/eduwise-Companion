'use client'
import React, { useCallback, useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CircleIcon, Info, Plus, StarIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { course, createChat as persisteChatOnDB } from "@/lib/courses"
import { DialogContextType, useDialog } from "@/components/context/DialogContext"
import CourseInfoDialog from "./CouseInfoDialog"
import { Button } from "../ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useCourseContext } from "@/components/context/CourseContext"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"

const Courses = ({ courses }) => {
    const { dialogs, openDialog, closeDialog } = useDialog() as DialogContextType
    const router = useRouter()
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/login")
        }
    })
    const { toast } = useToast()
    const { resetCourseList } = useCourseContext()
    const { createChat, setActiveChatId } = useLocalChatStore.getState()


    const handleCreateChat = async (e, course: course) => {
        e.preventDefault()
        const result = await persisteChatOnDB(course, session.user.id)

        if (result.id) {
            result.courseName = course.shortname
            createChat(result)
            // need to reload course List
            resetCourseList()
            setActiveChatId(result.id)
            router.push(`/chat/${result.id}`)
        } else {
            toast({
                variant: "destructive",
                title: "Course creation failled",
                description: "Please contact admin for more info.."
            })
        }
    }


    return (
        <>
            {
                courses.map((course: course, index: React.Key) => (
                    <div className="h-full">
                        <div className="max-w-md mx-auto bg-white rounded-lg border overflow-hidden md:max-w-2xl mb-2">
                            <div className="md:flex">
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-2 line-clamp-1">{course.shortname}</h2>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{course.summary}</p>
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex items-center text-sm ">
                                            <CircleIcon className="mr-1 h-3 w-3 fill-red-400 text-sky-400" />
                                            {course.origin}
                                        </div>
                                        <div className="flex items-center text-sm ">
                                            <StarIcon className="mr-1 h-3 w-3" />
                                            {course.chats ? `${course.chats.length} chat/s` : '0 chat'}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button variant="ghost" onClick={() => openDialog(`courseDialog${index}`)} className="p-2 rounded-lg border">
                                            <Info />
                                        </Button>

                                        <Button variant="ghost" onClick={(e) => handleCreateChat(e, course)} className="p-2 rounded-lg border">
                                            <Plus />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CourseInfoDialog
                            isOpen={dialogs[`courseDialog${index}`]}
                            toogleDialog={() => closeDialog(`courseDialog${index}`)}
                            course={course}
                        />
                    </div>
                ))
            }
        </>
    )
}


export default Courses