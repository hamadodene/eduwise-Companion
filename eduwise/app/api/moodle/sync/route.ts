// get all courses from moodle and save it on db
// if the courseID already exist on db, only update
// content is not dowloaded in this case -- this can introduce more latency
// We can provide a flag to force dowload all content if user need..
// We can also provider an enpoint to dowload content for specific course 

import { NextRequest, NextResponse } from "next/server"
import { initializeclient } from "@/lib/moodle/client"
import { generateCoursePrompt } from "@/lib/prompts"
import MoodleApi from "@/lib/moodle/moodleApi"


interface Course {
  id: string
  shortname: string
  fullname: string
  summary: string
  systemPrompt: string
}

interface CourseModel {
  moodleCourseId: string
  shortname: string
  fullname: string
  summary: string
  origin?: string
  userId?: string
  systemPrompt: string
}


class DefaultCourse implements CourseModel {
  moodleCourseId: string
  shortname: string
  fullname: string
  summary: string
  origin: string = "moodle"
  userId: string
  systemPrompt: string

  constructor(course: Course, userId: string) {
    this.moodleCourseId = course.id.toString()
    this.shortname = course.shortname
    this.fullname = course.fullname
    this.summary = course.summary
    this.systemPrompt = generateCoursePrompt(course.fullname) // system prompt generation
    this.userId = userId
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body
    console.log("user id " + userId)

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

    // Get all courses from moodle
    const coursesData = await client.getAllCourses()
    // now we have all courses data. We can now save it on DB filtering by only important field
    const courses: Course[] = JSON.parse(JSON.stringify(coursesData))

    // Insert userid and origin
    const coursesWithDefaults: DefaultCourse[] = courses.map(
      (course: Course) => new DefaultCourse(course, userId)
    )

    // Fetch existing courses from the database based on their moodleCourseId
    // This is because if a moodle course already esist for specific user, we don't need to recreate the course. We can only try do update changed fields
    const existingCourses = await prisma.course.findMany({
      where: {
        moodleCourseId: { in: coursesWithDefaults.map((course) => course.moodleCourseId) },
      },
    })

    // Compare and update courses in the database
    for (const course of coursesWithDefaults) {
      const existingCourse = existingCourses.find(
        (c) => c.moodleCourseId === course.moodleCourseId
      )

      if (existingCourse) {
        // Check if any field has changed
        const hasChanged = (
          existingCourse.shortname !== course.shortname ||
          existingCourse.fullname !== course.fullname ||
          existingCourse.summary.replace( /(<([^>]+)>)/ig, '') !== course.summary
          // Add more fields to check for changes as needed
        )

        if (hasChanged) {
          await prisma.course.update({
            where: { id: existingCourse.id },
            data: {
              shortname: course.shortname,
              fullname: course.fullname,
              summary: course.summary.replace( /(<([^>]+)>)/ig, '')
            },
          })
        }
      } else {
        // Course does not exist in the database, create it
        await prisma.course.create({
          data: {
            moodleCourseId: course.moodleCourseId,
            shortname: course.shortname,
            fullname: course.fullname,
            summary: course.summary.replace( /(<([^>]+)>)/ig, '') ,
            origin: course.origin,
            userId: course.userId,
            systemPrompt: course.systemPrompt
          }
        })
      }
    }
    return NextResponse.json({ status: 200, success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: 500, message: error, success: false })
  }
}