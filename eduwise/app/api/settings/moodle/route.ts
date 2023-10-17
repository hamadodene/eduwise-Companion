import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
// This only save credential on DB..
// The credential check is already handle by /moodle/check
// from moodle credential check successfully, the obtained token is store on db
// before save credential you can first check
export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json()

        const {
            userId,
            url,
            token
        } = body.config

        if (!url) {
            return NextResponse.json("Missing moodle url", { status: 400 })
        }

        if (!token) {
            return NextResponse.json("Missing username or password", { status: 400 })
        }

        const exist = await prisma.moodleCredential.findFirst({
            where: {
                userId: userId
            }
        })

        if (exist) {
            const result = await prisma.moodleCredential.update({
                where: { userId: userId },
                data: {
                    token: token,
                    url: url
                }
            })
            return NextResponse.json(result)

        } else {
            const result = await prisma.moodleCredential.create({
                data: {
                    userId: userId,
                    token: token,
                    url: url
                }
            })
            return NextResponse.json(result)
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 400, message: error })
    }
}