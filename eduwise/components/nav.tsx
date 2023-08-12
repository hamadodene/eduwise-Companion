"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  Home,
  LineChart,
  LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type Item = {
  href: string
  name: string
  icon?: LucideIcon
  color?: string
}

export const Nav = () => {
  return (
    <nav className="flex flex-col gap-4 w-full">
      <ScrollArea>
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className={
              "flex px-4 items-center w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <Home className="h-4 w-4" />
            <span className="rounded-md text-lg font-semibold py-1">Home</span>
          </Link>

          <Link
            href="/"
            className={
              "flex px-4 items-center w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <LineChart className="h-4 w-4" />
            <span className="rounded-md text-lg font-semibold py-1">Example1</span>
          </Link>
          <Link
            href="/"
            className={
              "flex px-4 items-center w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <LineChart className="h-4 w-4" />
            <span className="rounded-md text-lg font-semibold py-1">Example2</span>
          </Link>
          <Link
            href="/"
            className={
              "flex px-4 items-center w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <LineChart className="h-4 w-4" />
            <span className="rounded-md text-lg font-semibold py-1">Example3</span>
          </Link>
          <Link
            href="/"
            className={
              "flex px-4 items-center w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
            }
          >
            <LineChart className="h-4 w-4" />
            <span className="rounded-md text-lg font-semibold py-1">Example3</span>
          </Link>
        </div>
      </ScrollArea>
    </nav>
  )
}

export const NavItem = ({
  item,
  isSubItem,
}: {
  item: Item
  isSubItem?: boolean
}) => {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      className={cn(
        `gap-2 cursor-pointer hover:bg-slate-200
        dark:hover:bg-slate-800 group flex w-full items-center border border-transparent py-1 hover:underline text-muted-foreground`,
        isSubItem ? "text-sm text-muted-foreground pl-8" : "",
        isActive
          ? "text-slate-950 dark:text-white bg-slate-200 dark:bg-slate-800 font-bold rounded-none"
          : ""
      )}
      href={item.href}
    >
      {item?.color && !item.icon ? (
        <div
          className="w-4 h-4 rounded-full"
          style={{ background: item.color }}
        ></div>
      ) : null}
      {item.icon ? (
        <item.icon
          className={"h-4 w-4"}
          style={
            item.color
              ? {
                  color: item.color,
                }
              : {}
          }
        />
      ) : null}
      <span>{item.name}</span>
    </Link>
  )
}

const FilterTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex px-6 items-center justify-between w-full gap-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800"
      )}
    >
      <span className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
        {children}
      </span>
      <ChevronDown />
    </div>
  )
}