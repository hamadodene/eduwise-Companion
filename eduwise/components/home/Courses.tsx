'use client'
import React from "react"

import { CircleIcon, PlusIcon, StarIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { course, createChat as persisteChatOnDB } from "@/lib/courses"
import { useDialog } from "@/components/context/DialogContext"
import CourseInfoDialog from "./CouseInfoDialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { useCourseContext } from "@/components/context/CourseContext"
import { useLocalChatStore } from "@/lib/chat/local-chat-state"
import { Separator } from "../ui/separator"

const Courses = ({ courses }) => {
    const { dialogs, openDialog, closeDialog } = useDialog()
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
                courses.map((course: course) => (
                    <div key={course.id} className="relative hover:cursor-pointer border-2 shadow-xl rounded-lg hover:border-[#20c997] w-full">
                        <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-2xl mb-2" onClick={(e) => {
                            e.preventDefault()
                            openDialog(`courseDialog${course.id}`)
                        }}>
                            <div className="md:flex">
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold mb-2 line-clamp-1">{course.shortname}</h2>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{course.summary}</p>
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex items-center text-sm ">
                                            <CircleIcon className={`mr-1 h-3 w-3
                                             ${course.origin === "moodle" ? "fill-red-400" : "fill-yellow-400"} text-sky-400`} />
                                            {course.origin}
                                        </div>
                                        <div className="flex items-center text-sm ">
                                            <StarIcon className="mr-1 h-3 w-3" />
                                            {course.chats ? `${course.chats.length} chat/s` : '0 chat'}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="w-full rounded absolute bottom-0">
                            <Separator className="bg-[#20c997]"/>
                            <div onClick={(e) => handleCreateChat(e, course)} className="flex items-center justify-center p-2 gap-2 hover:cursor-pointer bg-slate-200">
                                <PlusIcon size={15} /><p>Create chat</p>
                            </div>
                        </div>

                        <CourseInfoDialog
                            isOpen={dialogs[`courseDialog${course.id}`]}
                            toogleDialog={() => closeDialog(`courseDialog${course.id}`)}
                            course={course}
                        />
                    </div>
                ))
            }
        </>
    )
}


export default Courses