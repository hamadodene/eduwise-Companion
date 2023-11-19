import { NextRequest, NextResponse } from "next/server"
import { initializeclient } from "@/lib/moodle/client"
import MoodleApi from "@/lib/moodle/moodleApi"
import { NextApiResponse } from "next"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { fileUrl, userId } = body
        console.log("url " + fileUrl)

        //First inizialize moodle client
        let client: MoodleApi
        try {
            client = await initializeclient(userId)
        } catch (error) {
            console.error('Error initializing Moodle Api:', error)
            return NextResponse.json({ status: 400, message: error })
        }

        // check if client is initialized
        if (!client) {
            return NextResponse.json({ error: 'MoodleApi not initializzed' }, { status: 500 })
        }
        try {

            const startIndex = extractPathFromUrl(fileUrl).indexOf("pluginfile.php") + "pluginfile.php".length;
            const extractedPath = extractPathFromUrl(fileUrl).slice(startIndex)
            const content = await client.downloadContent(extractedPath)

            const response = new NextResponse(content)
            const filename = getFilenameFromUrl(fileUrl)
            response.headers.set('Content-Type', 'application/octet-stream');
            response.headers.set('Content-Disposition', `attachment; filename=${filename}`);

            return response
        } catch (error) {
            console.error('Error downloading content:', error);
            return NextResponse.json({ status: 500, message: 'Error downloading content' });
        }

    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ status: 500, message: 'Internal Server Error' })
    }
}

function extractPathFromUrl(url: string): string | null {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname;
    } catch (error) {
        console.error(`Error parsing URL: ${error.message}`);
        return null;
    }
}
function getFilenameFromUrl(url: string) {
    const urlParts = url.split('/')
    const filename = urlParts[urlParts.length - 1]
    const filenameWithoutQuery = filename.split('?')[0]

    return filenameWithoutQuery;
}