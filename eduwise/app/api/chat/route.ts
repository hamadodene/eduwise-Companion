import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

// Get all chats
export async function GET() {
    try {
        const chats = await prisma.chat.findMany()
        return NextResponse.json(chats)
    } catch (error) {
        return NextResponse.json({ status: 401, message: error })
    }
}

// Create chat
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            courseId
        } = body

        // Check if courseId exist
        const exist = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        })

        if (!exist) {
            return NextResponse.json({ status: 400, message: "course not found" })
        }

        const autoTitle = "New conversation"
        const chat = await prisma.chat.create({
            data: {
                autoTitle,
                courseId
            }
        })

        return NextResponse.json(chat)
    } catch (error) {
        return NextResponse.json({ status: 401, message: error })
    }
}
