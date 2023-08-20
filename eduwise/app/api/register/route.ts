import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

import prisma from '@/lib/prismadb'

export async function POST(
    request:Request
) {
    const body = await request.json()
    const {
        email,
        name,
        password
    } = body

    if(!name || !password || !email) {
        return NextResponse.json("Missing name, email or password", { status: 400})
    }

    const exist = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(exist) {
        return NextResponse.json("User already exists", { status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    })

    return NextResponse.json(user);
}
