// edit message
// delete message

import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function UPDATE(request: NextRequest, route: { params: { id: string } }) {
    try {
        const body = await request.json()
        const {
            text,
            updateAt
        } = body
        const messageId = route.params.id

        const result = prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                text: text,
                updatedAt: updateAt
            }
        })
        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

export async function DELETE(route: { params: { id: string } }) {
    try {
        const messageId = route.params.id

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