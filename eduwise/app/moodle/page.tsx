/**
 * This is a test page
 * Used to test if the moodle client is working properly
 */
'use client'

import React, { useState, useEffect } from 'react';
import MoodleClient from '@/lib/moodle/moodleClient';
import Wsfunctions from '@/lib/moodle/wsfunctions';
import { Separator } from '@/components/ui/separator';


export default function page() {
    const [client, setClient] = useState<MoodleClient | null>(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const credentials = {
            username: 'user',
            password: 'bitnami',
        };

        const moodleClient = new MoodleClient({
            url: 'http://localhost:8081',
            strictSSL: false,
            ...credentials,
        });

        moodleClient.authenticateClient(credentials.username, credentials.password)
            .then(authenticatedClient => {
                setClient(authenticatedClient);
                return authenticatedClient.call({
                    wsfunction: Wsfunctions.GET_ALL_COURSES,
                });
            })
            .then(courses => {
                setCourses(courses);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>Lista dei corsi</h1>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <h2>{course.fullname}</h2>
                        <ul>
                            {Object.keys(course).map(key => (
                                <li key={key}>
                                    {key}: {JSON.stringify(course[key])}
                                </li>
                            ))}
                        </ul>
                        <Separator className='my-4' />
                    </li>
                ))}
            </ul>
        </div>
    );
}
