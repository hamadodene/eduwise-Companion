'use client'

import { PropsWithChildren, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { chatHistory } from "@/data/chathistory"
import { Chat } from "@/components/chat"

export const AppLayout = (props: PropsWithChildren) => {

  return (
    <div className="flex h-screen">
      <div className="flex w-60 border-r hidden md:block">
        <Sidebar chatHistory={chatHistory} />
      </div>
      <div className="flex-1">
        <div className="flex relative items-center h-[60px] border-r border-b-2">
          <NavBar />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            {/* CONTENT HERE*/}
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}
