import React from "react"
import { course, documents } from "@/lib/courses"
import { Button } from "../ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Download, ScanFaceIcon } from "lucide-react"
import { Separator } from "../ui/separator"

const ContentsTab = (props: { course: course }) => {
    const contents: documents[] = props.course.documents
    return (
        <div className="rounded-md overflow-y-auto p-4">
            {contents.length === 0 ? (
                <p>No content for this selected course.</p>
            ) : (
                <div className="flex flex-col">
                    {contents.map((pdf, index) => (
                        <div key={index} className="flex items-center justify-between mb-2 p-2 border-b hover:cursor-pointer">
                            <div className="w-11/12">
                                <p className="font-bold">{pdf.name}</p>
                                <textarea className="resize-none text-sm text-gray-500 w-full bg-white" defaultValue={pdf.filename} disabled/>
                            </div>
                            <Popover>
                                <PopoverTrigger>
                                    <Button variant="ghost">...</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-40">
                                    <div>
                                        <div className='rounded-lg hover:cursor-pointer'>
                                            <div className='bg-transparent h-10 flex items-center space-x-2 text-opacity-90'>
                                                <Download size={15} />
                                                <p className="text-sm">Download</p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className='rounded-lg'>
                                            <div className="rounded-lg bg-transparent mt-2 flex items-center space-x-2 text-opacity-90">
                                                <ScanFaceIcon size={15} />
                                                <p className="text-sm">Preview</p>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ContentsTab