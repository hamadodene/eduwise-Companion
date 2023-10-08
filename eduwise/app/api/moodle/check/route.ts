import { NextResponse } from "next/server";

//Api to check if token is valid
// Note credential cannot be save on DB here...User can decide to change it
export async function POST(
    request: Request
) {
    const body = await request.json()
    const {
        url,
        username,
        password,
        moodletoken
    } = body

    if (!moodletoken && username && password) {
        // token not provide, try get token from username and password
        const queryParams = new URLSearchParams({
            username: username,
            password: password
        })

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await fetch(`${this.url}/login/token.php?${queryParams}`, options)
            const data = await response.json()
            if ('token' in data) {
                this.token = data.token
                return NextResponse.json({ status: 200, message: "OK" })

            } else if ('error' in data) {
                return NextResponse.json({ status: 400, message: data.error })
            } else {
                return NextResponse.json({ status: 500, message: "authentication failed: unexpected server response" })
            }
        } catch (error) {

            return NextResponse.json({ status: 400, message: 'Error during credential validation' })
        }

    } else {
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
                return NextResponse.json({ status: 401, message: "Invalid token" })
            }
        } catch (error) {

            console.error('Error checking token:', error);
            return NextResponse.json({ status: 400, message: 'Error during token validation' })
        }

    }
}
