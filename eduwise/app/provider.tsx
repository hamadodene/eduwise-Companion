"use client"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/components/context/sidebarContext"
import { DialogProvider } from "@/components/context/DialogContext"
import { ChatHistoryProvider } from "@/components/context/ChatHistoryContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DialogProvider>
          <ChatHistoryProvider>
            {children}
          </ChatHistoryProvider>
        </DialogProvider>
      </SidebarProvider>
    </SessionProvider>
  )
}