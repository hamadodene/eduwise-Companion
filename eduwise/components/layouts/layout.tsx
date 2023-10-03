'use client'

import Sidebar from "@/components/sidebar"

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col dark:bg-slate-900 w-full h-full">
        {children}
      </div>
    </div>
  )
}
