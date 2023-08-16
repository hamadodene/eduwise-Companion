'use client'

import * as React from "react"
import { Button } from "./ui/button"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState } from "react";
import TypingAnimation from "./TypingAnimation"

export function Chat() {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  const prompt = `${input}`

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: input,
      },
    ]);
    setInput("")

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return
    }

    const reader = data.getReader();
    const decoder = new TextDecoder()
    let done = false
    let generatedResponse = ""

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading
      const chunkValue = decoder.decode(value)
      generatedResponse += chunkValue
    }

    setLoading(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "gpt",
        content: generatedResponse,
      },
    ]);
  };
  return (
    <>
      <div className="flex-1 overflow-y-auto mt-4 mx-2 p-4">
        <ScrollArea className="w-full">
          <div className="space-y-4">
            {
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground whitespace-normal max-w-lg bg-sky-200 max-w-sm md:max-w-lg"
                      : "bg-muted mr-auto whitespace-normal bg-teal-600 max-w-sm md:max-w-lg"
                  )}
                >
                  {message.content}
                </div>
              ))}
            {
              loading && (
                <div key={messages.length} className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  "bg-muted mr-auto whitespace-normal max-w-sm md:max-w-lg")}
                >
                  <TypingAnimation />
                </div>
              )}
          </div>
        </ScrollArea>
      </div>
      <div className="sticky bottom-5 mt-4 mx-0 md:mx-2 rounded-lg shadow-md border-2 p-4 min-w-screen flex items-center justify-center">
        <div className="flex w-full items-center space-x-2">
          <textarea
            value={input}
            id="message"
            onChange={(e) => setInput(e.target.value)}
            className="flex items-center grow h-auto h-30 shadow-2xl rounded-lg items-center outline-0 resize-none bg-transparent dark:bg-transparent"
          ></textarea>
          {!loading ? (
            <Button size="icon" onClick={(e) => generateResponse(e)}>
              <PaperPlaneIcon className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          ) : (
            <Button disabled size="icon">
              <svg width="24" height="24" stroke="#000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round">
                    <animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" />
                    <animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" />
                  </circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" />
                </g>
              </svg>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}