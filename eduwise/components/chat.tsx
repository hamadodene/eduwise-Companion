'use client'

import * as React from "react"
import { BookCopyIcon, Send } from "lucide-react"
import { Button } from "./ui/button"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"

export function Chat() {
  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
  ])

  return (
    <>
      <div className="mt-4 mx-2 rounded-lg p-4 items-center">
        <div className=" flex items-center left-[100px] space-x-2 inset-y-10 inset-x-10">
          {/*<BookCopyIcon className="mr-2" size={50} color="green" />*/}
          <div className="w-full">
            <input type="text" className="m-0 px-2 rounded-md text-gray-400 w-full truncate bg-transparent dark:bg-transparent"
              defaultValue="📚🔥 Explore the fundamentals of Machine Learning." />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 mx-2 p-4">
        <ScrollArea className="w-full">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground whitespace-normal max-w-lg bg-sky-200"
                    : "bg-muted mr-auto whitespace-normal bg-teal-600"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="sticky bottom-0 mt-4 mx-2 rounded-lg shadow-md p-4">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setMessages([
              ...messages,
              {
                role: "user",
                content: event.currentTarget.message.value,
              },
            ])
            event.currentTarget.message.value = ""
          }}
          className="flex w-full items-center space-x-2"
        >
          <textarea
            id="message"
            placeholder="Type your message..."
            className="flex-1 grow h-auto h-30 shadow-lg rounded-lg items-center resize-none bg-transparent dark:bg-transparent"
          ></textarea>
          <Button type="submit" size="icon">
            <PaperPlaneIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  )
}