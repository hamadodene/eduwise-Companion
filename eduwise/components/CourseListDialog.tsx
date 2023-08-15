"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "./ui/dialog"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command"

import { CheckIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"

const courses = [
    {
        name: "Introduction to AI",
        description: "Learn the basics of Artificial Intelligence.",
        startDate: "2023-09-01",
        progress: 25,
    },
    {
        name: "Machine Learning Fundamentals",
        description: "Explore the fundamentals of Machine Learning.",
        startDate: "2023-09-15",
        progress: 50,
    },
    {
        name: "Natural Language Processing",
        description: "Dive into Natural Language Processing techniques.",
        startDate: "2023-10-01",
        progress: 10,
    },
    {
        name: "Deep Learning Techniques",
        description: "Master advanced Deep Learning methods.",
        startDate: "2023-10-15",
        progress: 75,
    },
    {
        name: "Computer Vision Basics",
        description: "Get started with Computer Vision concepts.",
        startDate: "2023-11-01",
        progress: 90,
    },
] as const;

type Course = (typeof courses)[number];


export function CouseListDialog({ ...props }) {
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

    return (
        <DialogContent className="gap-0 p-0 outline-none">
            <DialogHeader className="px-4 pb-4 pt-5">
                <DialogTitle>Select a Course</DialogTitle>
                <DialogDescription>
                    Choose a course to create a new thread.
                </DialogDescription>
            </DialogHeader>
            <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
                <CommandInput placeholder="Search course..." />
                <CommandList>
                    <CommandEmpty>No courses found.</CommandEmpty>
                    <CommandGroup className="p-2">
                        {courses.map((course) => (
                            <CommandItem
                                key={course.name}
                                className="flex items-center px-2"
                                onSelect={() => {
                                    setSelectedCourse(course);
                                }}
                            >
                                <Avatar>
                                <AvatarFallback>{course.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-2">
                                    <p className="text-sm font-medium leading-none">
                                        {course.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {course.description}
                                    </p>
                                </div>
                                {selectedCourse === course ? (
                                    <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                                ) : null}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
            <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
                {selectedCourse ? (
                    <div className="flex -space-x-2 overflow-hidden">
                        <Avatar
                            key={selectedCourse.name}
                            className="inline-block border-2 border-background"
                        >
                            <AvatarFallback>{selectedCourse.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Select a course to add to this thread.
                    </p>
                )}
                <Button disabled={!selectedCourse}>
                    Continue
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}