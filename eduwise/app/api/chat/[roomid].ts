import prisma from '@/lib/prismadb'
import { NextResponse } from "next/server"
import { OpenAIStream, OpenAIStreamPayload } from "@/lib/openAiStream";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const roomId = params.id

        if (!roomId) {
            return NextResponse.json("Missing roomId", { status: 400 })
        }

        const messages = await prisma.message.findMany({
            where: {
                roomId: roomId
            }
        })

        if (!messages) {
            return NextResponse.json("No message found..", { status: 404 })
        }

        return NextResponse.json(messages)

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}


export async function POST(req: Request, { params }: { params: { id: string } }): Promise<Response> {

    const roomId = params.id
    const body = await req.json()
    const { request, response } =  body

    if (!roomId) {
        return NextResponse.json({ error: "No room id present...!" })
    };

    if (!request && !response) {
        return NextResponse.json({ error: "Request and response cannot be empty" })
    }

    /** get current room */
    const rooms = await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })

    if (!rooms) {
        return NextResponse.json({ error: "No room found...!" })
    }

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing env var from OpenAI");
      }

    const { prompt } = (await req.json()) as {
        prompt?: string;
      };
    
      if (!prompt) {
        return NextResponse.json("No prompt in the request", { status: 400 });
      }
    
      const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
        n: 1,
      };
    
      const stream = await OpenAIStream(payload);
      return new NextResponse(stream);
}