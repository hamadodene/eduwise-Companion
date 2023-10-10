// /api/chat/info/[chatid]

import { NextResponse } from "next/server"

//Get chat info
export async function GET(route: { params: { id: string } }) {
    try {
        const chatId: string = route.params.id
        const chatInfo = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        })
        return NextResponse.json(chatInfo)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}
