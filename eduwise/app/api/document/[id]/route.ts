import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const documentId: string = params.id

        const document = await prisma.document.findUnique({
            where: {
                id: documentId
            }
        })

        if (!document) {
            return NextResponse.json({ status: 400, message: "documentId not found" })
        }

        const {
            url
        } = body

        const result = await prisma.document.update({
            where: {
                id: documentId
            },
            data: {
                aws_url: url,
                store_in_aws: true
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 400, message: error })
    }
}
