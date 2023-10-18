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
import { course } from "@/lib/courses"
import { useDialog } from "@/components/context/DialogContext"
import CourseInfoDialog from "./CouseInfoDialog"
import { Button } from "../ui/button"


interface CourseProps {
    courses: course[]
}

const Courses = ({ courses }) => {
    const { dialogs, openDialog, closeDialog } = useDialog();
    // TODO
    // create chat button
    //inprove Dialog style

    return (
        <>
            {
                courses.map((course: course, index: React.Key) => (
                    <Card key={index} className='relative transition ease-in-out duration-800  hover:shadow-lg hover:border-[#A3E4D7] hover:bg-[#f3f3f3] h-52'>
                        <CardHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className='w-full'>
                                <CardTitle className='overflow-hidden truncate' >{course.shortname}</CardTitle>
                            </div>
                            <div className="space-y-1 w-full">
                                <CardDescription className="line-clamp-3">
                                    {course.summary}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CircleIcon className="mr-1 h-3 w-3 fill-red-400 text-sky-400" />
                                    {course.origin}
                                </div>
                                <div className="flex items-center">
                                    <StarIcon className="mr-1 h-3 w-3" />
                                    {course.chats ? `${course.chats.length} chat/s` : '0 chat'} chat/s
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="absolute space-x-4 ">
                                <Button variant="ghost" onClick={() => openDialog(`courseDialog${index}`)} className="p-2 rounded-lg border">
                                    <Info size={15} />
                                </Button>

                                <Button variant="ghost" className="p-2 rounded-lg border">
                                    <Plus size={15} />
                                </Button>
                            </div>
                        </CardFooter>
                        <CourseInfoDialog
                            isOpen={dialogs[`courseDialog${index}`]}
                            toogleDialog={() => closeDialog(`courseDialog${index}`)}
                            course={course}
                        />
                    </Card>
                ))
            }
        </>
    )
}


export default Courses