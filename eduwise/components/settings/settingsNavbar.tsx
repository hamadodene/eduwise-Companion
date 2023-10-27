'use client'

import React from "react"
import { useSidebar } from "../context/sidebarContext"
import { Button } from "../ui/button"
import { Link, ListMinus, XIcon } from "lucide-react"

const NavBar = () => {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="p-4 h-20/100 flex items-center justify-between border-b mb-5">
            <div className="flex items-center justify-beetween rounded-lg space-x-2">
                <Button variant="ghost" onClick={toggleSidebar} className="ml-auto mr-2 px-4 py-2 lg:hidden">
                    <ListMinus />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold">Settings</h1>
                    <p className="text-sm">All settings</p>
                </div>
            </div>
            <div className="flex space-x-4">
                <Link href="/">
                    <Button variant="ghost" className="border-2" size="icon">
                        <XIcon className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default NavBar