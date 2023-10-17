import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server"

//Get moodle info
export async function GET(request: NextRequest, { params }: { params: { userid: string } }) {
    try {

        const userid = params.userid

        if (!userid) {
          return NextResponse.json({ status: 400, message: "Missing 'userid' parameter" });
        }

        const moodleInfo = await prisma.moodleCredential.findUnique({
            where: {
                userId: userid.toString()
            }
        })
        return NextResponse.json(moodleInfo)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 400, message: error })
    }
}