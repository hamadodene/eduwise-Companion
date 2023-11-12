import MoodleClient from './moodleClient'
import Wsfunctions from './wsfunctions'

class MoodleApi {
    private moodleClient: MoodleClient

    constructor(options: {
        url: string,
        logger?: any,
        service?: string,
        token?: string,
        strictSSL?: boolean
    }) {
        this.moodleClient = new MoodleClient(options)
    }

    async getAllCourses() {
        try {
            const courses = await this.moodleClient.call({
                wsfunction: Wsfunctions.GET_ALL_COURSES,
                method: 'GET'
            })

            return courses
        } catch (error) {
            throw new Error(`Error while fetching courses: ${error.message}`)
        }
    }

    async getCourseContents(courseId: string) {
        try {
           const courseContents = await this.moodleClient.call({
            wsfunction: Wsfunctions.GET_COURCE_CONTENT,
            args: {
                courseid: courseId
            },
            method: 'GET'
           }) 
           return courseContents
        } catch (error) {
            throw new Error(`Error while fetching course ${courseId} contents: ${error.message}`)
        }
    }
}

export default MoodleApi
