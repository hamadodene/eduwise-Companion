"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toogle";
import { Menu, Plus, User } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { chatHistory } from "@/data/chathistory"
import { Dialog, DialogTrigger } from "./ui/dialog";
import { CouseListDialog } from "./CourseListDialog";

export function NavBar({ ...props }) {
    return (
        <div className="grid grid-cols-2 gap-4 w-full content-center">
            <div className="col-span-1 col-start-1 flex gap-2 items-center justify-center relative left-5">
                <div className="bg-primary rounded-lg md:hidden">
                <Sheet key={"left"}>
                    <SheetTrigger asChild>
                        <Menu size={35} color="white" />
                    </SheetTrigger>
                    <SheetContent className="flex flex-col w-3/4 h-full" side="left">
                        <Sidebar chatHistory={chatHistory} />
                    </SheetContent>
                </Sheet>
                </div>

                <input type="text" className="m-0 px-2 border-none rounded-md text-gray-400 w-full outline-0 truncate bg-transparent dark:bg-transparent"
                    defaultValue="📚🔥 Explore the fundamentals of Machine Learning." />
            </div>
            <div className="col-span-1 flex items-center justify-end">
                <div className="w-full">
                    <div className="flex justify-end space-x-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-lg">
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span className="whitespace-nowrap hidden sm:block">New Chat</span>
                                </Button>
                            </DialogTrigger>
                            <CouseListDialog />
                        </Dialog>
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </div>
    )
}