'use client'

import React, { useCallback, useEffect } from 'react'
import NavBar from './HomeNavbar'
import Courses from './Courses'
import { useSession } from 'next-auth/react'
import { getAllCourses } from '@/lib/courses'
import { useCourseContext } from '@/components/context/CourseContext'

function HomePage() {
    const { data: session } = useSession()
    const { addCourse, courseList } = useCourseContext()

    const handleGetAllCourses = useCallback(async () => {
        console.log('Session is available:', session)
        if (session) {
            const result = await getAllCourses(session.user.id)
            result.forEach(res => {
                addCourse(res)
            })
        }
    }, [session])

    useEffect(() => {
        if (courseList.length === 0) {
            handleGetAllCourses()
        }
    }, [session, handleGetAllCourses])

    if (!session) {
        // Return some loading indicator or a message while waiting for the session.
        return <div>Loading...</div>;
    }
    
    return (
        <div className='flex flex-col h-full'>
            <NavBar />
            {/* Content */}
            <div className="overflow-y-scroll container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 mb-5 mt-2 overflow-hidden">
                <Courses courses={courseList} />
            </div>
        </div>
    )
}

export default HomePage