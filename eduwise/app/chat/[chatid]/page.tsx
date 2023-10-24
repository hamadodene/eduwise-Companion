'use client'
import Chat from "@/components/chat/Chat"
import { Layout } from "@/components/layouts/layout"
import React, {  } from "react"
import { usePathname } from 'next/navigation'

export default function page() {
    const chatPathName = usePathname()
    const parts = chatPathName.split('/')
    const chatId = parts[parts.length - 1]

    return (
        <Layout>
            <Chat chatId={chatId} />
        </Layout>
    )
}