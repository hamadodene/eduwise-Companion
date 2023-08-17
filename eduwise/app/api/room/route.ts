import prisma from "@/lib/prismadb"
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const rooms = await prisma.room.findMany()
        return NextResponse.json(rooms)
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title } = body

        const exist = await prisma.room.findUnique({
            where: {
                title: title
            }
        })

        if (exist) {
            return NextResponse.json("Room alread exists", { status: 400 })
        }

        const room = await prisma.room.create({
            data: {
                title: title
            }
        })

        return NextResponse.json({ success: true, data: room })

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}
