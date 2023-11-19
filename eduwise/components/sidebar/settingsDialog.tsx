'use client'
import React from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import OpenaiSettings from "../settings/openai"
import MoodleSettings from "../settings/moodle"

interface SettingsDialogProps {
    isOpen: boolean
    toogleDialog: () => void
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, toogleDialog }) => {
    return (
        <Dialog open={isOpen} onOpenChange={toogleDialog}>
            <DialogContent className="md:max-w-[680px] rounded-lg">
                <DialogHeader className="border-b">
                    <DialogTitle className="mb-4">Settings</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full h-12 grid-cols-3 bg-[#12b886] text-white">
                        <TabsTrigger
                            className="h-10 data-[state=active]:bg-[#0ca678] data-[state=active]:text-white"
                            value="general">
                            General
                        </TabsTrigger>
                        <TabsTrigger className="h-10 data-[state=active]:bg-[#0ca678] data-[state=active]:text-white"
                            value="openai">
                            OpenAI
                        </TabsTrigger>
                        <TabsTrigger className="h-10 data-[state=active]:bg-[#0ca678] data-[state=active]:text-white"
                            value="moodle">
                            Moodle
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="openai">
                        <OpenaiSettings />
                    </TabsContent>
                    <TabsContent value="moodle">
                        <MoodleSettings />
                    </TabsContent>
                    <TabsContent value="general">
                        <div className="rounded-lg ml-2 mr-2 mt-5 mb-10">
                            <div className="flex items-center justify-between p-4 border-b">
                                <div>
                                    <div className="text-lg font-semibold">Reset all data</div>
                                    <div className="text-gray-500">This will be delete all stored courses, chats and documents</div>
                                </div>
                                <div>
                                    <Button variant="ghost" className="bg-red-100 hover:bg-red-200 text-red-700">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <div>
                                    <div className="text-lg font-semibold">Clear all chats</div>
                                    <div className="text-gray-500">This will be delete all chats, include messages</div>
                                </div>
                                <div>
                                    <Button variant="ghost" className="bg-red-100 hover:bg-red-200 text-red-700">
                                        Clear
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsDialog