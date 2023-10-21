import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

// Delete chat
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const chatId: string = params.id
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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const chatId: string = params.id
        const {
            userTitle,
            autoTitle,
            updateAt
        } = body

        const result = await prisma.chat.update({
            where: {
                id: chatId
            },
            data: {
                userTitle: userTitle,
                autoTitle: autoTitle,
                updatedAt: updateAt
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

//Get all messages of chat
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const chatId: string = params.id
        const messages = await prisma.message.findMany({
            where: {
                id: chatId
            }
        })
        return NextResponse.json(messages)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

// Add message to chat
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const chatId: string = params.id
        console.log('body ' + JSON.stringify(body.newMessage))
        const {
            text,
            sender,
            role,
            userId
        } = body.newMessage

        const result = await prisma.message.create({
            data: {
                userId: userId,
                chatId: chatId,
                text: text,
                sender: sender,
                role: role
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.log("add message to chat " + error)
        return NextResponse.json({ status: 400, message: error })
    }
}