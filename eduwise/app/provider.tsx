"use client"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/components/context/sidebarContext"
import { DialogProvider } from "@/components/context/DialogContext"
import { CourseProvider } from "@/components/context/CourseContext"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DialogProvider>
            <CourseProvider>
                {children}
            </CourseProvider>
        </DialogProvider>
      </SidebarProvider>
    </SessionProvider>
  )
}