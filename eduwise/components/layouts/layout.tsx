'use client'

import { PropsWithChildren, useState } from "react"

import Sidebar from "@/components/sidebar"
import NavBar from "@/components/navbar"

export const Layout = ({ children }) => {
  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <div className="w-5/6 flex flex-col dark:bg-slate-900">
        {/* Navbar */}
        <div className="h-1/5">
          <NavBar/>
        </div>
        <div className="h-4/5 p-4 relative">
          {children}
        </div>
      </div>
    </div>
  )
}
