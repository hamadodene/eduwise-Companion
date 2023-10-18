'use client'
import React, { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { course } from "@/lib/courses"

interface CourseInfoDialogProps {
    course: course
    isOpen: boolean
    toogleDialog: () => void
}

const CourseInfoDialog: React.FC<CourseInfoDialogProps> = ({ isOpen, toogleDialog, course }) => {
    const isMoodleCourse = course.origin === 'moodle';

    const [fullname, setFullname] = useState("")
    const [shortname, setShortname] = useState("")
    const [summary, setSummary] = useState("")

    const handleFullnameChange = event => {
        setFullname(event)
    }

    const handleShortnameChange = event => {
        setShortname(event)
    }

    const handleSummaryChange = event => {
        setSummary(event)
    }

    return (
        <Dialog key={course.fullname} open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Course info</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullname" className="text-right">
                            Fullname
                        </Label>
                        <Input
                            id="fullname"
                            defaultValue={course.fullname}
                            className="col-span-3"
                            onChange={handleFullnameChange}
                            disabled={isMoodleCourse}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shortname" className="text-right">
                            Shortname
                        </Label>
                        <Input
                            id="shortname"
                            defaultValue={course.shortname}
                            className="col-span-3"
                            onChange={handleShortnameChange}
                            disabled={isMoodleCourse}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="summary" className="text-right">
                            Summary
                        </Label>
                        <textarea
                            id="summary"
                            defaultValue={course.summary}
                            onChange={handleSummaryChange}
                            className="col-span-3"
                            disabled={isMoodleCourse}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="origin" className="text-right">
                            Origin
                        </Label>
                        <input
                            id="origin"
                            value={course.origin}
                            className="col-span-3"
                            disabled
                        />
                    </div>
                </div>
                {!isMoodleCourse && ( // Render the button only if it's not a moodle course
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CourseInfoDialog