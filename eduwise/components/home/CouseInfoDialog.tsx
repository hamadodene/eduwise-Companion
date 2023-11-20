'use client'
import React from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { course } from "@/lib/courses"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import InfoTab from "./InfoTab"
import ContentsTab from "./ContentsTab"

interface CourseInfoDialogProps {
    course: course
    isOpen: boolean
    toogleDialog: () => void
}

const CourseInfoDialog: React.FC<CourseInfoDialogProps> = ({ isOpen, toogleDialog, course }) => {
    return (
        <Dialog open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent className="md:max-w-[680px] rounded-lg">
                <DialogHeader className="border-b">
                    <DialogTitle className="mb-4">{course.shortname}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full h-12 grid-cols-2 bg-[#12b886] text-white">
                        <TabsTrigger
                            className="h-10 data-[state=active]:bg-[#0ca678] data-[state=active]:text-white"
                            value="info">
                            Info
                        </TabsTrigger>
                        <TabsTrigger className="h-10 data-[state=active]:bg-[#0ca678] data-[state=active]:text-white"
                            value="contents">
                            Contents processed for ai
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <InfoTab course={course}/>
                    </TabsContent>
                    <TabsContent value="contents">
                        <ContentsTab course={course}/>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default CourseInfoDialog