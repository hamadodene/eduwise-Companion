'use client'

import React, { useCallback, useEffect, useState } from 'react'
import NavBar from './HomeNavbar'
import Courses from './Courses'
import { useSession } from 'next-auth/react'
import { course, getAllCourses } from '@/lib/courses'
import CourseInfoDialog from './CouseInfoDialog'

function HomePage() {
    const { data: session } = useSession()
    const [courseData, setCourseData] = useState<course[]>([])


    const handleGetAllCourses = useCallback(async () => {
        if (session) {
            const result = await getAllCourses(session.user.id)
            setCourseData(result)
        }
    }, [session])

    useEffect(() => {
        handleGetAllCourses()
    }, [session])

    const handleCreateChat = async (event) => {
        event.preventDefault()
    }

    const handleCourseInfo = async (event, courseId: string) => {
        event.preventDefault()
    }

    return (
        <div className='flex flex-col h-full'>
            <NavBar />
            {/* Content */}
            <div className="overflow-y-scroll container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mb-5 mt-2 overflow-hidden">
                <Courses courses={courseData} />
            </div>
        </div>
    )
}

export default HomePage