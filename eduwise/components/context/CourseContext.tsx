import { documents } from '@/lib/courses'
import { createContext, useContext, useState } from 'react'

export type Course = {
  id?: string
  shortname: string,
  fullname: string,
  summary: string,
  origin?: string,
  userId: string,
  systemPrompt: string,
  chats: []
  documents: documents[]
}

export type CourseContextType = {
  courseList: Course[]
  addCourse: (newCourse: Course) => void
  resetCourseList: () => void
  editCourse: (courseId: string, updatedCourse: Course) => void
  editDocumentInCourse: (courseId: string, documentId: string, updatedDocument: documents) => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export function CourseProvider({ children }) {
  const [courseList, setCourseList] = useState<Course[]>([])

  const addCourse = (newCourse: Course) => {
    setCourseList((prevCourseList) => [newCourse, ...prevCourseList])
  }

  const resetCourseList = () => {
    setCourseList([])
  }

  const editCourse = (courseId: string, updatedCourse: Course) => {
    setCourseList((prevCourseList) =>
      prevCourseList.map((course) =>
        course.id === courseId ? { ...course, ...updatedCourse } : course
      )
    )
  }

  const editDocumentInCourse = (courseId: string, documentId: string, updatedDocument: documents) => {
    setCourseList((prevCourseList) =>
      prevCourseList.map((course) =>
        course.id === courseId
          ? {
            ...course,
            documents: course.documents.map((document) =>
              document.id === documentId ? { ...document, ...updatedDocument } : document
            ),
          }
          : course
      )
    )
  }


  return (
    <CourseContext.Provider value={{ courseList, addCourse, resetCourseList, editCourse, editDocumentInCourse }}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourseContext() {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider')
  }
  return context
}
