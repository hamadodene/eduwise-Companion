"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      className="routed-lg border-2"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Icons.sun className="rotate-0 scale-0 transition-all dark:-rotate-90 dark:scale-100" width={15} height={15}/>
      <Icons.moon className="absolute rotate-90 scale-100 transition-all dark:rotate-0 dark:scale-0" width={15} height={15} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}