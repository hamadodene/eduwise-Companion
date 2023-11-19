'use client'

import React, { useCallback, useEffect, useState } from 'react'
import NavBar from './HomeNavbar'
import Courses from './Courses'
import { useSession } from 'next-auth/react'
import { getAllCourses } from '@/lib/courses'
import { useCourseContext } from '@/components/context/CourseContext'
import { useRouter } from 'next/navigation'
import { Icons } from '../icons'

function HomePage() {
    const router = useRouter()
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/login")
        },
    })
    const { addCourse, courseList } = useCourseContext()
    const [loadingCourse, setLoadingCourse] = useState(false)

    const handleGetAllCourses = useCallback(async () => {
        if (session && !(new Date() > new Date(session.expires))) {
            setLoadingCourse(true)
            const result = await getAllCourses(session.user.id)
            result.forEach(res => {
                console.log(res.documents)
                addCourse(res)
            })
            setLoadingCourse(false)
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
            {
                loadingCourse ? (
                    <div className='flex items-center justify-center h-full'>
                        <Icons.animeted_spinner/>
                        <p className="text-center">Loading courses...</p>
                    </div>
                ) : courseList.length > 0 ? (
                    <div className="overflow-y-scroll container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 h-full gap-2 mt-2 mb-2 overflow-hidden">
                        <Courses courses={courseList} />
                    </div>
                ) : (
                    <div className='flex items-center justify-center h-full'>
                        <p className="text-center">No course available.<br /> Add new course or configure your moodle account.</p>
                    </div>
                )
            }
        </div>
    )
}

export default HomePage