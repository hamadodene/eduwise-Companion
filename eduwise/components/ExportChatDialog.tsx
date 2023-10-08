'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Share2Icon } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"

export const ExportChatDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="border-2" size="icon">
                    <Share2Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Chat Message</DialogTitle>
                </DialogHeader>
                <div className="border rounded-lg">
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <div className="text-lg font-semibold">Export format</div>
                            <div className="text-gray-500">Json or Text format</div>
                        </div>
                        <div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="json" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="text">text</SelectItem>
                                        <SelectItem value="json">json</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" className="border-2">
                        <Share2Icon className="h-4 w-4 mr-2" /> Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
