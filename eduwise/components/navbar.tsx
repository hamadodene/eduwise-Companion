"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import { Share2Icon } from 'lucide-react';
import { EnterFullScreenIcon, Pencil1Icon } from "@radix-ui/react-icons"

const NavBar = () => {
    return (
        <div className="p-4 h-20/100 flex items-center justify-between border-b">
            <div>
                <h1 className="text-2xl font-semibold">Nuova conversasione</h1>
                <p className="text-sm">2 messaggi con eduwise</p>
            </div>
            <div className="flex space-x-4">
                <Button variant="ghost" className="border-2" size="icon">
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="border-2" size="icon">
                    <Share2Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="border-2" size="icon">
                    <EnterFullScreenIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default NavBar;