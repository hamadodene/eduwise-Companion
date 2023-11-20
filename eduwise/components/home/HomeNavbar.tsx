"use client"

import * as React from "react"
import { Search } from "../search"
import { Button } from "../ui/button"
import { ListMinus, Plus } from "lucide-react"
import { useSidebar } from '../context/sidebarContext'
import CustomCourseDialog from "./CustomCourseDialog"
import { useDialog } from "../context/DialogContext"

const NavBar = () => {
    const { toggleSidebar } = useSidebar()
    const { dialogs, openDialog, closeDialog } = useDialog()

    return (
        <div className="flex items-center justify-center border h-auto">
            <div className="flex items-center justify-center p-4 rounded-lg space-x-2">
                <Button variant="ghost" onClick={toggleSidebar} className="ml-auto mr-2 px-4 py-2 lg:hidden">
                    <ListMinus />
                </Button>
                <Search />
            </div>
            <Button variant="ghost" size="lg" className="ml-auto mr-2 px-4 py-2 border rounded-md space-x-2 border-[#20c997]"
                onClick={(e) => {
                    e.preventDefault()
                    openDialog("customCourseDialog")
                }}>
                <Plus size={15} /><span className="hidden lg:block">Add course</span>
            </Button>
            <CustomCourseDialog
                isOpen={dialogs["customCourseDialog"]}
                toogleDialog={() => closeDialog("customCourseDialog")}
            />
        </div>
    )
}

export default NavBar