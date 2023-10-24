'use client'

import Sidebar from "@/components/sidebar/sidebar"
import { motion } from "framer-motion"
import { useSidebar } from "../context/sidebarContext"

export const Layout = ({ children }) => {
  const { isSidebarOpen } = useSidebar()

  return (
    <div className="flex flex-row mg:flex-col h-screen font-sans">
      <Sidebar />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 flex-col dark:bg-slate-900 w-full h-full transition-opacity duration-300 ease-in-out md:w-full md:ml-72"
      >
        {children}
      </motion.div>
    </div>
  )
}
