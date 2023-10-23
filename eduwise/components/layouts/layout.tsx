'use client'

import Sidebar from "@/components/sidebar/sidebar"
import { motion } from "framer-motion"

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-row h-screen font-sans">
      <Sidebar />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col dark:bg-slate-900 w-full h-full transition-opacity duration-300 ease-in-out"
      >
        {children}
      </motion.div>
    </div>
  )
}
