'use client'

import { Layout } from "@/components/layouts/layout"
import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export default function page() {
    return (
        <Layout>
            <div className="p-4 h-20/100 flex items-center justify-between mb-5">
                <Button variant="ghost" className="px-4 py-2 rounded-lg items-center">
                    <ChevronLeft className="w-4 h-4 mr-2" size={15} /> Return
                </Button>
                <div className="flex space-x-4">
                    <Button variant="ghost" className="px-4 py-2 rounded-lg items-center">
                        <Plus className="w-4 h-4 mr-2" size={15} /> Add new course
                    </Button>
                </div>
            </div>
            <ScrollArea>
                <div className="h-4/5 p-4 relative">
                    <div className="container mx-auto">
                        <div className="flex justify-center">
                            <img src="/test.png" alt="Your Image" />
                        </div>
                        {/* Title */}
                        <div className="text-center mt-2">
                            <h1 className="text-3xl font-bold">Pick a Course</h1>
                        </div>

                        {/* subtitle */}
                        <div className="text-center mt-2">
                            <span className="text-gray-400">Chat with eduwise to enhance your skills</span>
                        </div>

                        {/* Card Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            <Card className="hover:border-sky-300 transform transition duration-300 hover:shadow-lg hover:scale-110">
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-sky-300 transform transition duration-300 hover:shadow-lg hover:scale-110">
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-sky-300 transform transition duration-300 hover:shadow-lg hover:scale-110">
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-sky-300 transform transition duration-300 hover:shadow-lg hover:scale-110">
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-sky-300 transform transition duration-300 hover:shadow-lg hover:scale-110">
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:border-sky-300 transform transition duration-300 hover:shadow-lg hover:scale-110">
                                <CardHeader>
                                    <CardTitle>Card Title</CardTitle>
                                    <CardDescription>Card Description</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </Layout>
    )
}
