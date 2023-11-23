// edit message
// delete message

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function PUT(request: NextRequest,{ params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const {
            text
        } = body

        const messageId = params.id
        const result = await prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                text: text
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const messageId = params.id

        await prisma.message.delete({
            where: {
                id: messageId
            }
        })

        return NextResponse.json({ status: 200, message: "OK" })
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}