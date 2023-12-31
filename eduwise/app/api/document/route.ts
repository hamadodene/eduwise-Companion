import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/prismadb'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            courseId,
            name,
            filename,
            url,
            mimetype,
            aws_url,
            store_in_aws
        } = body
        const result = await prisma.document.create({
            data: {
                courseId: courseId,
                name: name,
                filename: filename,
                mimetype: mimetype,
                aws_url: aws_url,
                store_in_aws: store_in_aws,
                url: url
            }
        })
        return NextResponse.json(result)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 400, message: error })
    }
}
