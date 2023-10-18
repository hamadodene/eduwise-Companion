'use client'

import React, { useCallback, useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CircleIcon, StarIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { chat, course, getChats, getCourse } from "@/lib/courses"

const ChatHistory = () => {

    const { data: session } = useSession()
    const [chatData, setChatData] = useState<chat[]>([])

    const handleGetAllchats = useCallback(async () => {
        if (session) {
            const result = await getChats(session.user.id)

            for (let i = 0; i < result.length; i++) {
                const course = await getCourse(result[i].courseId) as course
                result[i].couseName = course.shortname
            }

            setChatData(result)
        }
    }, [session])

    useEffect(() => {
        handleGetAllchats()
    }, [session])


    return (
        <>
            {
                chatData.map((chat, index) => (
                    <Card key={index} className='hover:border-sky-300  mt-2'>
                        <CardHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className='w-full'>
                                <CardTitle className='overflow-hidden truncate'>{chat.autoTitle || chat.userTitle}</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CircleIcon className="mr-1 h-3 w-3 fill-red-400 text-sky-400" />
                                    Machine learning
                                </div>
                                <div className="flex items-center">
                                    <StarIcon className="mr-1 h-3 w-3" />
                                    {chat.messages.length} msg
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
        </>
    )
}

export default ChatHistory