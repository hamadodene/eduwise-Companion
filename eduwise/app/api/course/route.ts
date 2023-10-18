
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
import { generateCoursePrompt } from "@/lib/prompts";

// Create courses
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        let origin = "custom"

        const {
            shortname,
            fullname,
            summary,
            userId
        } = body

        const systemPrompt = generateCoursePrompt(fullname)

        const result = await prisma.course.create({
            data: {
                shortname,
                fullname,
                summary,
                origin,
                userId,
                systemPrompt
            }
        })
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}


export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userid")

        const result = await prisma.course.findMany({
            where: {
                userId: userId
            }
        })
        return NextResponse.json(result)

    } catch (error) {
        
        return NextResponse.json({ status: 400, message: error })

    }
}
