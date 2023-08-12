"use client"

import * as React from "react"

export function AppCommand({ ...props }: any) {
  return (
    <div className="relative">
        <button
          className="absolute right-2 text-muted-foreground"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
        </button>
    </div>
  )
}