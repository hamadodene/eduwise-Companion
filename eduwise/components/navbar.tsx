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
        <>
            {/* NAVBAR HERE*/}
            <Sheet>
                <SheetTrigger className="md:hidden absolute left-5 bg-primary rounded">
                    <Menu size={35} color="white" />
                </SheetTrigger>
                <SheetContent className="flex flex-col w-3/4 h-full">
                    <Sidebar chatHistory={chatHistory} />
                </SheetContent>
            </Sheet>

            <div className="absolute grid grid-flow-col gap-3 right-5">
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                <span className="font-extrabold whitespace-nowrap hidden sm:block">New Chat</span>
                            </Button>
                        </DialogTrigger>
                        <CouseListDialog/>
                    </Dialog>
                </div>
                <div>
                    <ModeToggle />
                </div>
            </div>
        </>
    )
}