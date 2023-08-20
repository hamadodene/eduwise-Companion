import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MoodleClient from "@/lib/moodle/moodleClient";

export async function POST(
    request: Request
) {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    let token: string

    const {
        url,
        username,
        password,
        forceupdate,
        moodletoken
    } = body

    if (!url) {
        return NextResponse.json("Missing moodle url", { status: 400 })
    }

    if (!moodletoken && (!username || !password)) {
        return NextResponse.json("Missing username or password", { status: 400 })
    }

    const exist = await prisma.moodleCredential.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if (moodletoken) {
        token = moodletoken
    } else {
        const moodleClient = new MoodleClient({
            url: url,
            password: password,
            username: username
        }).authenticateClient(username, password)
        token = (await moodleClient).token
    }
    if (exist && forceupdate) {
        try {
            const result = await prisma.moodleCredential.update({
                where: { userId: session.user.id },
                data: {
                    token: token,
                    url: url
                }
            })
            return NextResponse.json(result)
        } catch (error) {
            return NextResponse.json('Error during moodle credential update')
        }
    } else if (exist && !forceupdate) {
        return NextResponse.json("Token already configured..Use forceupdate to update with new token", { status: 400 })
    } else {
        try {
            const result = await prisma.moodleCredential.create({
                data: {
                    userId: session.user.id,
                    token: token,
                    url: url
                }
            })
            return NextResponse.json(result)
        } catch (error) {
            return NextResponse.json('Error during moodle credential update')
        }
    }
}