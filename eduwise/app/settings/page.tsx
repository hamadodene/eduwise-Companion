
import { Layout } from "@/components/layouts/layout"
import React from "react"
import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import OpenaiSettings from "@/components/settings/openai"
import Link from "next/link"
import MoodleSettings from "@/components/settings/moodle"

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
                <OpenaiSettings/>
                <MoodleSettings/>

                {/* Reset and clear data */}
                <div className="border rounded-lg ml-2 mr-2 mt-5 mb-10">

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
