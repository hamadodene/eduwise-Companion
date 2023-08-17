import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"


export async function GET(request: Request, { params }: { params: { id: string }}) {
    try {
        const roomId = params.id

        if (!roomId) {
            console.log("Herrrrr")
            return NextResponse.json("Missing roomId", {status: 400})
        }

        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            }
        })

        return NextResponse.json(room)
    } catch (error) {
        console.log("Maybe heerrr " + error)
        return NextResponse.json({ error }, { status: 400 })
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string }}) {
    try {

        const roomId = params.id

        if (!roomId) {
            return NextResponse.json("Missing roomId", {status: 400})
        }

        await prisma.room.delete({
            where: {
                id: roomId
            }
        })
        return NextResponse.json({ success: true, deleted: roomId })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })

    }
}