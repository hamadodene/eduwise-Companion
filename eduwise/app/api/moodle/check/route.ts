import { NextResponse } from "next/server";

//Api to check if token is valid
export async function POST(
    request: Request
) {
    const body = await request.json()
    const {
        url,
        moodletoken
    } = body

    try {
        const response = await fetch(`${url}/webservice/rest/server.php?wstoken=${moodletoken}`, {
            method: 'GET'
        });

        if (response.status === 200) {
            const responseData = await response.json();
            console.log('Token is valid:', responseData);
            return NextResponse.json('Token is valid')

        } else {
            console.log('Token is not valid:', response.status, response.statusText);
            return NextResponse.json('Token is not valid')
        }
    } catch (error) {
        console.error('Error checking token:', error);
        return NextResponse.json('Error during token validation')
    }
}