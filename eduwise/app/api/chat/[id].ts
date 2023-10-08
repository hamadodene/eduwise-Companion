import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

// Delete chat
export async function DELETE(request: NextRequest, route: { params: { id: string } }) {
    try {
        const chatId: string = route.params.id
        // Delete first all messages
        await prisma.message.deleteMany({
            where: {
                chatId: chatId
            }
        })
        // then delete chat
        await prisma.chat.delete({
            where: {
                id: chatId
            }
        })
        return NextResponse.json({ status: 200, message: "OK" })
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

// Update chat data
export async function UPDATE(request: NextRequest, route: { params: { id: string } }) {
    try {
        const body = await request.json()
        const chatId: string = route.params.id
        const {
            userTitle,
            autoTitle
        } = body

        const result = await prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                userTitle: userTitle,
                autoTitle: autoTitle
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({status: 400, message: error})
    }
}

//Get all messages of chat
export async function GET(route: { params: { id: string } }) {
   try {
    const chatId: string = route.params.id
    const messages = await prisma.message.findMany({
        where: {
            id: chatId
        }
    })
    return NextResponse.json(messages)
   } catch (error) {
        return NextResponse.json({status: 400, message: error})
   } 
}