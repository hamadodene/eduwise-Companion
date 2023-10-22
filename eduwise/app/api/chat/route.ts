import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

// Get all chats
export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userid")
        const chats = await prisma.chat.findMany({
            where: {
                userId: userId
            },
            include: {
                messages: true
            }
        })
        return NextResponse.json(chats)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 401, message: error })
    }
}

// Create chat
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            courseId,
            courseName,
            userId,
            model
        } = body.chatData
        
        // Check if courseId exist
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        })

        if (!course) {
            return NextResponse.json({ status: 400, message: "course not found" })
        }

        const systemPrompt = course.systemPrompt

        const chat = await prisma.chat.create({
            data: {
                courseId,
                courseName,
                systemPrompt,
                model,
                userId
            }
        })

        return NextResponse.json(chat)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 401, message: error })
    }
}
