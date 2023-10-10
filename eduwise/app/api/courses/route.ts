
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

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

        const result = await prisma.course.create({
            data: {
                shortname,
                fullname,
                summary,
                origin,
                userId
            }
        })
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}
