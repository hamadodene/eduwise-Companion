import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb'

// save openai token in DB
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            apiKey,
            apiOrganizationId,
            model,
            userId
        } = body.config

        if (!apiKey || !apiOrganizationId) {
            return NextResponse.json({ status: 400, message: "Api key or organization id is not provide but both are mondatory" })
        }
        const exist = await prisma.openAi.findUnique({
            where: {
                userId: userId
            }
        })

        let result: { id: string; userId: string; apiKey: string; apiOrganizationId: string; }

        if (exist) {
            result = await prisma.openAi.update({
                where: {
                    userId: userId
                },
                data: {
                    apiKey: apiKey,
                    apiOrganizationId: apiOrganizationId,
                    model: model
                }
            })
        } else {
            result = await prisma.openAi.create({
                data: {
                    apiKey: apiKey,
                    apiOrganizationId: apiOrganizationId,
                    userId: userId,
                    model: model
                }
            })
        }

        return NextResponse.json({id: result.id, apiKey: result.apiKey, apiOrganizationId: result.apiOrganizationId})
    } catch (error) {
        return NextResponse.json({ status: 400, message: error })
    }

}
