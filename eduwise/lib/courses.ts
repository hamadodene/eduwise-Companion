import { useSession } from "next-auth/react"

interface course {
    shortname: string,
    fullname: string,
    summary: string,
    origin?: string,
    userId: string
}

export async function createCourses(shortname: string, fullname: string, summary: string) {
    try {
        const { data: session } = useSession()
        const userId = session.user.id

        const courseData: Partial<course> = {
            shortname,
            fullname,
            summary,
            userId
        }

        const response = await fetch('/api/course', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ courseData })
        })

        return await response.json() as course
    } catch (error) {
        console.log(error)
    }
}

export async function deleteCourse(courseId: string) {
    try {
        const response = await fetch(`/api/course/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}


export async function updateCourse(newCourse: Partial<course>, courseId: string) {
    try {
        const message: Partial<course> = newCourse

        const response = await fetch(`/api/course/${courseId}`, {
            method: 'UPDATE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ message })
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function getAllCourses() {
    try {
        const { data: session } = useSession()
        const userId = session.user.id

        const response = await fetch('/api/course/', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(userId)
        })

        return await response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function getCourse(courseId: string) {
    try {
        const response = await fetch(`/api/course/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}