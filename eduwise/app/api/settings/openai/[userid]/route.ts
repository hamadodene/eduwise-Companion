import { NextRequest, NextResponse } from "next/server"

//Get openai info
export async function GET(request: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const userid = params.userid
        const openAiInfo = await prisma.openAi.findUnique({
            where: {
                userId: userid
            }
        })
        return NextResponse.json(openAiInfo || {})
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}