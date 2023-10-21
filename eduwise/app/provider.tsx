"use client"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/components/context/sidebarContext"
import { DialogProvider } from "@/components/context/DialogContext"
import { ChatHistoryProvider } from "@/components/context/ChatHistoryContext"
import { CourseProvider } from "@/components/context/CourseContext"
import { SettingsProvider } from "@/components/context/SettingsContext"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DialogProvider>
          <ChatHistoryProvider>
            <CourseProvider>
              <SettingsProvider>
                {children}
              </SettingsProvider>
            </CourseProvider>
          </ChatHistoryProvider>
        </DialogProvider>
      </SidebarProvider>
    </SessionProvider>
  )
}