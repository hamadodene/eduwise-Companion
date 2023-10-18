import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function UPDATE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const courseId: string = params.id

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        })

        if (!course) {
            return NextResponse.json({ status: 400, message: "Course not found" })
        }

        if (!course.origin.match("custom")) {
            return NextResponse.json({ status: 400, message: "Only custom course can be edit" })
        }

        const {
            shortname,
            fullname,
            summary
        } = body

        const result = await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                shortname: shortname,
                fullname: fullname,
                summary: summary
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const courseId: string = params.id

        // Check if coure is custom course
        const deletable = await prisma.course.findUnique({
            where: {
                id: courseId,
                AND: [
                    {
                        origin: { equals: "custom" }
                    }
                ]
            }
        })

        if (!deletable) {
            return NextResponse.json({ status: 400, message: "Only custom course can be DELETED" })
        }

        // first get all Chats of this specific courses
        const chats = await prisma.chat.findMany({
            where: {
                courseId: courseId
            }
        })

        //Now delete all message of every chats
        //Maybe we can improve - TODO
        for (const chat of chats) {
            await prisma.message.deleteMany({
                where: {
                    chatId: chat.id
                }
            });
        }

        // then delete all chats of courses
        await prisma.chat.deleteMany({
            where: {
                courseId: courseId
            }
        })

        // Then delete course
        await prisma.course.delete({
            where: {
                id: courseId
            }
        })

        return NextResponse.json({ status: 200, message: "OK" })
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

// get course info
export async function GET({ params }: { params: { id: string } }) {
    try {
        const courseId: string = params.id

        const result = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        })
        return NextResponse.json({ result })
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

//Upload content 
// TODO