'use client'
import Chat from "@/components/Chat"
import ChatFooter from "@/components/ChatFooter"
import NavBar from "@/components/ChatNavbar"
import { Layout } from "@/components/layouts/layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import React from "react"

export default function page() {
    return (
        <Layout>
            <div className="flex flex-col h-screen">
                <NavBar />
                <ScrollArea className="flex-grow">
                    <Chat />
                </ScrollArea>
                <ChatFooter />
            </div>
        </Layout>
    )
}