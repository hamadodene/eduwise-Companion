import { NextResponse } from "next/server";

// This only save credential on DB..
// The credential check is already handle by /moodle/check
// before save credential you can first check
export async function POST(
    request: Request
) {
    const body = await request.json()


    const {
        userId,
        url,
        username,
        password,
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
            userId: userId
        }
    })

    if (exist) {
        try {
            const result = await prisma.moodleCredential.update({
                where: { userId: userId },
                data: {
                    token: moodletoken,
                    username: username,
                    password: password,
                    url: url
                }
            })
            return NextResponse.json(result)
        } catch (error) {
            return NextResponse.json('Error during moodle credential update')
        }
    } else {
        try {
            const result = await prisma.moodleCredential.create({
                data: {
                    userId: userId,
                    token: moodletoken,
                    username: username,
                    password: password,
                    url: url
                }
            })
            return NextResponse.json(result)
        } catch (error) {
            return NextResponse.json('Error during moodle credential update')
        }
    }
}