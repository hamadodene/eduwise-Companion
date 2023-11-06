import React, { createContext, useContext, useState } from 'react'

export type SidebarContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setIsSidebarOpen: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)


export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar , setIsSidebarOpen}}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
