import { Message } from "./chat/store-chats"

export interface course {
    id?: string
    shortname: string
    fullname: string
    summary: string
    origin?: string
    userId: string
    systemPrompt: string
    chats: []
    documents: []
}

export interface chat {
    id: string
    userTitle: string
    autoTitle: string
    userId: string
    createdAt: Date
    updatedAt: Date
    courseId: string
    courseName?: string
    systemPrompt: string
    messages: Message[]
    suggestions: suggestions[]
}

export interface documents {
    id: string,
    aws_url?: string
    mimetype: string
    name: string
    filename: string
    store_in_aws: boolean
    url?: string
}

export interface suggestions {
    title: string
    content: string
    difficulty_level: string
    priority: string
    importance: string
}

export async function createCourses(shortname: string, fullname: string, summary: string, userId: string) {
    try {
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

export async function addDocument(courseId: string, name: string, url: string) {
    try {
        const response = await fetch('/api/document', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ 
                courseId: courseId,
                name: name,
                filename: name,
                url: url,
                mimetype: "application/pdf",
                aws_url: url,
                store_in_aws: true
             })
        })
        return await response.json()
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

export async function getAllCourses(userId: string) {
    try {
        const response = await fetch(`/api/course?userid=${userId}`, {
            method: 'GET'
        })


        return await response.json() as course[]
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

export async function getChats(userId: string) {
    try {
        const response = await fetch(`/api/chat?userid=${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
        return await response.json() as chat[]
    } catch (error) {
        console.log(error)
    } 
}


export async function createChat(selectedCourse: course, userId: string) {
    try {
        const courseId = selectedCourse.id
        const createdAt = new Date()
        const courseName = selectedCourse.shortname
        const chatData: Partial<chat> = {
            courseId,
            courseName,
            createdAt,
            userId
        }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ chatData })
        })

        return await response.json() as chat
    } catch (error) {
        console.log(error)
    }
}