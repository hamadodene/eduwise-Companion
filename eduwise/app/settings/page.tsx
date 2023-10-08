'use client'

import { Layout } from "@/components/layouts/layout"
import React from "react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function page() {

    return (
        <Layout>
            <div className="p-4 h-20/100 flex items-center justify-between border-b mb-5">
                <div>
                    <h1 className="text-2xl font-semibold">Settings</h1>
                    <p className="text-sm">All settings</p>
                </div>
                <div className="flex space-x-4">
                    <Link href="/">
                        <Button variant="ghost" className="border-2" size="icon">
                            <XIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
            <ScrollArea>
                {/* GPT settings */}
                <div className="border rounded-lg ml-10 mr-10">
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">GPT model</div>
                            <div className="text-gray-500">Select the model you want to use as default</div>
                        </div>
                        <div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="gpt-3.5-turbo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="gpt-4">gpt-4</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">OPENAI key</div>
                            <div className="text-gray-500">Set your custom openai token</div>
                        </div>
                        <div>
                            <Input type="password" placeholder="Openai key" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Test OpenAI connection</div>
                            <div className="text-gray-500">Check if your configured credential work properly</div>
                        </div>
                        <div>
                            <Button variant="ghost" className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                Check
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Moodle settings */}
                <div className="border rounded-lg ml-10 mr-10 mt-5">
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Username</div>
                            <div className="text-gray-500">Set your moodle username</div>
                        </div>
                        <div>
                            <Input type="text" placeholder="username" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Password</div>
                            <div className="text-gray-500">Set your moodle password</div>
                        </div>
                        <div>
                            <Input type="password" placeholder="password" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Token</div>
                            <div className="text-gray-500">Set your moodle token</div>
                        </div>
                        <div>
                            <Input type="password" placeholder="token" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Endpoint</div>
                            <div className="text-gray-500">Set your moodle endpoint</div>
                        </div>
                        <div>
                            <Input type="text" placeholder="https://my-moodle-url.example.com" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Test Moodle Connection</div>
                            <div className="text-gray-500">Check if your configured credential work properly</div>
                        </div>
                        <div>
                            <Button variant="ghost" className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                Check
                            </Button>
                        </div>
                    </div>
                </div>


                {/* Reset and clear data */}
                <div className="border rounded-lg ml-10 mr-10 mt-5 mb-10">

                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Reset All Settings</div>
                            <div className="text-gray-500">Reset all settings to default</div>
                        </div>
                        <div>
                            <Button variant="ghost" className="bg-red-100 hover:bg-red-200 text-red-700">
                                Reset
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Clear All Data</div>
                            <div className="text-gray-500">Clear all messages and settings</div>
                        </div>
                        <div>
                            <Button variant="ghost" className="bg-red-100 hover:bg-red-200 text-red-700">
                                Clear
                            </Button>
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </Layout>
    )
}
