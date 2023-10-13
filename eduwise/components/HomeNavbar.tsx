"use client"

import * as React from "react"
import { Search } from "./search"
import { Button } from "./ui/button"
import { ListMinus } from "lucide-react"
import { useSidebar } from './sidebarContext'

const NavBar = () => {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="flex items-center justify-center border h-auto">
            <div className="flex items-center justify-center p-4 rounded-lg space-x-2">
                <Button variant="ghost" onClick={toggleSidebar} className="ml-auto mr-2 px-4 py-2 lg:hidden">
                    <ListMinus />
                </Button>
                <Search />
            </div>
            <Button variant="ghost" className="ml-auto mr-2 px-4 py-2 border rounded-md">
                Add Course
            </Button>
        </div>
    )
}

export default NavBar