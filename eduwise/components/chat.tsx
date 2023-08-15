'use client'

import * as React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Chat() {

  return (
    <>
      <div className="relative flex flex-row items-center">
        <div className="absolute flex items-center space-x-4 inset-y-10 inset-x-10 ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Image" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">Eduwise</p>
            <p className="text-sm text-muted-foreground">info@wduwise.app</p>
          </div>
        </div>
      </div>
    </>
  )
}