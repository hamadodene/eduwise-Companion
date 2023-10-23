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
}

type CourseContextType = {
  courseList: Course[]
  addCourse: (newCourse: Course) => void
  resetCourseList: () => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export function CourseProvider({ children }) {
  const [courseList, setCourseList] = useState<Course[]>([])

  const addCourse = (newCourse: Course) => {
    setCourseList((prevCourseList) => [newCourse, ...prevCourseList])
  }

  const resetCourseList =  () => {
    setCourseList([])
  }

  return (
    <CourseContext.Provider value={{ courseList, addCourse, resetCourseList }}>
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
