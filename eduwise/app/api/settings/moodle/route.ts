import { NextResponse } from "next/server";
import prisma from '@/lib/prismadb'
// This only save credential on DB..
// The credential check is already handle by /moodle/check
// from moodle credential check successfully, the obtained token is store on db
// before save credential you can first check
export async function POST(
    request: Request
) {
    try {

        const body = await request.json()

        const {
            userId,
            url,
            moodletoken
        } = body

        if (!url) {
            return NextResponse.json("Missing moodle url", { status: 400 })
        }

        if (!moodletoken) {
            return NextResponse.json("Missing username or password", { status: 400 })
        }

        const exist = await prisma.moodleCredential.findFirst({
            where: {
                userId: userId
            }
        })

        let result: { id: string; userId: string; token: string; url: string }
        if (exist) {
            result = await prisma.moodleCredential.update({
                where: { userId: userId },
                data: {
                    token: moodletoken,
                    url: url
                }
            })

        } else {
            result = await prisma.moodleCredential.create({
                data: {
                    userId: userId,
                    token: moodletoken,
                    url: url
                }
            })
        }

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}

//Get moodle info
export async function GET(route: { params: { userid: string } }) {
    try {
        const userid: string = route.params.userid
        const moodleInfo = await prisma.openAi.findUnique({
            where: {
                userId: userid
            }
        })
        return NextResponse.json(moodleInfo)
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }
}