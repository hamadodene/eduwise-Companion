import Chat from "@/components/chat/Chat"
import { Layout } from "@/components/layouts/layout"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function page() {
    const session = await getServerSession(authOptions)
    if(!session) {
        redirect("/login")
    }
    
    return (
        <Layout>
            <Chat/>
        </Layout>
    )
}