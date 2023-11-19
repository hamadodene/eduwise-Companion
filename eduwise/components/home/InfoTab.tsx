import { course } from "@/lib/courses"
import React from "react"
import { Input } from "../ui/input"

const InfoTab = (props: { course: course }) => {
    const isMoodleCourse = props.course.origin === 'moodle';

    return (
        <div className="rounded-lg ml-2 mr-2 mt-5">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <div className="font-semibold">Fullname</div>
                </div>
                <div className="w-6/12">
                    <Input
                        type="text"
                        id="fullname"
                        value={props.course.fullname}
                        //onChange={handleUsernameInputChange}
                        disabled={isMoodleCourse}
                        placeholder="username" />
                </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <div className="font-semibold">shortname</div>
                </div>
                <div className="w-6/12">
                    <Input
                        type="text"
                        value={props.course.shortname}
                        //onChange={handlePasswordInputChange}
                        disabled={isMoodleCourse}
                        placeholder="password" />
                </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <div className="font-semibold">Origin</div>
                </div>
                <div className="w-6/12">
                    <input
                        type="text"
                        id="origin"
                        value={props.course.origin}
                        className="col-span-3"
                        disabled
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2 p-4 w-full">
                <div className="flex-1">
                    <textarea
                        id="summary"
                        defaultValue={props.course.summary}
                        //onChange={handleSummaryChange}
                        className="w-full"
                        disabled={isMoodleCourse}
                    />
                </div>
            </div>
        </div>
    )
}

export default InfoTab