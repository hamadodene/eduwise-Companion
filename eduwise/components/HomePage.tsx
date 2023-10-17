'use client'

import React from 'react'
import NavBar from './HomeNavbar'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CircleIcon, Info, Plus, StarIcon } from 'lucide-react'


function HomePage() {
    return (
        <div className='flex flex-col h-full'>
            <NavBar />
            {/* Content */}
            <div className="flex-1 overflow-y-scroll container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-2 mt-2 overflow-hidden">
                {Array.from({ length: 10 }, (v, i) => (
                    <Card key={i} className='relative transition ease-in-out duration-800  hover:shadow-lg hover:border-[#A3E4D7] hover:bg-[#f3f3f3] '>
                        <CardHeader className="flex flex-col items-start gap-4 space-y-0">
                            <div className='w-full'>
                                <CardTitle className='overflow-hidden truncate' >Macchine learning</CardTitle>
                            </div>
                            <div className="space-y-1 w-full">
                                <CardDescription>
                                    Beautifully designed components built with Radix UI and Tailwind CSS.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CircleIcon className="mr-1 h-3 w-3 fill-red-400 text-sky-400" />
                                    moodle
                                </div>
                                <div className="flex items-center">
                                    <StarIcon className="mr-1 h-3 w-3" />
                                    2 chat/s
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                        <div className="absolute space-x-4 ">
                                <button className="p-2 rounded-lg border">
                                    <Info size={15} />
                                </button>
                                <button className="p-2 rounded-lg border">
                                    <Plus size={15} />
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default HomePage