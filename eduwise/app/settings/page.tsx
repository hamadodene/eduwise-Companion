import { Layout } from "@/components/layouts/layout"
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import OpenaiSettings from "@/components/settings/openai"
import MoodleSettings from "@/components/settings/moodle"
import NavBar from "@/components/settings/settingsNavbar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { useSettingsStore } from "@/lib/settings/store-settings"

export default async function page() {
    const session = await getServerSession(authOptions)
    if(!session) {
        redirect("/login")
    }
    return (
        <Layout>
            <NavBar/>
            <ScrollArea>
                {/* GPT settings */}
                <OpenaiSettings/>
                <MoodleSettings />

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
