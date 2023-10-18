"use client";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/sidebarContext";
import { DialogProvider } from "@/components/context/DialogContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </SidebarProvider>
    </SessionProvider>
  )
}