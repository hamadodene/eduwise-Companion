import { NextRequest, NextResponse } from "next/server";

//Api to check if token is valid
// Note credential cannot be save on DB here...User can decide to change it
export async function POST(
    request: NextRequest
) {
    const body = await request.json()
    const {
        apiKey,
        apiOrganizationId
    } = body


    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            "OpenAI-Organization": `${apiOrganizationId}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    'role': 'user',
                    'content': 'Tell me a funny joke'
                }
            ]
        }),
    }
    const url = "https://api.openai.com/v1/chat/completions"

    try {
        const response = await fetch(url, options)

        if (response.status === 200) {
            return NextResponse.json({ status: 200, message: "OK" })
        } else {
            return NextResponse.json({ status: 401, message: "FAILLED" })
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ status: 401, message: "FAILLED" })
    }
}
