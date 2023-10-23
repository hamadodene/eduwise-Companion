'use client'

import React, { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { ReloadIcon } from "@radix-ui/react-icons"
import { checkResponse, moodle, useSettingsStore } from "@/lib/settings/store-settings"
import { useLocalSettingsStore } from "@/lib/settings/local-settings-store"

const MoodleSettings = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState('')
    const [url, setUrl] = useState('')

    const [isDisabled, setIsDisabled] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const { toast } = useToast()
    const { data: session } = useSession()
    const { setMoodleToken, setMoodleEndpoint, moodleToken, moodleEndpoint } = useLocalSettingsStore.getState()

    const [checkStatus, setCheckStatus] = useState<checkResponse>({
        status: '',
        message: '',
        success: false
    })

    const [credentials, setCredentials] = useState<moodle>({
        userId: '',
        token: '',
        url: ''
    })

    const handleUsernameInputChange = event => {
        setUsername(event.target.value)
    }

    const handlePasswordInputChange = event => {
        setPassword(event.target.value)
    }

    const handleTokenInputChange = event => {
        setToken(event.target.value)
    }

    const handleUrlInputChange = event => {
        setUrl(event.target.value)
    }

    const handleLoadMoodleCredentials = useCallback(async () => {
        if (session) {
            if (!moodleToken || !moodleEndpoint) {
                const result = await useSettingsStore.loadMoodleConfig(session.user.id)
                if (result) {
                    setMoodleToken(result.token)
                    setMoodleEndpoint(result.url)
                }
            }
        }
    }, [session])

    useEffect(() => {
        handleLoadMoodleCredentials()
    }, [session])

    const handleCheckMoodleSettings = async (e) => {
        e.preventDefault()
        setIsDisabled(true)
        const config: moodle = {
            token: token,
            url: url,
            username: username,
            password: password
        }
        const result = await useSettingsStore.checkMoodleCredential(config)

        setCheckStatus({
            ...checkStatus,
            success: result.success,
            status: result.status,
            message: result.message
        })

        console.log("resposne is " + JSON.stringify(result))
        if (result.status == "200") {
            if (token) {
                setCredentials({
                    token: token,
                    url: url,
                    userId: session.user.id
                })
            } else {
                setCredentials({
                    token: result.message,
                    url: url,
                    userId: session.user.id
                })
            }
            setButtonDisabled(false)
            toast({
                title: "Credentials are valid ",
                description: "You can save your credentials if you want."
            })
            setIsDisabled(false)
        } else {
            setButtonDisabled(true)
            toast({
                variant: "destructive",
                title: "Credentials are not valid ",
                description: "Please check. Token or url may not be valid."
            })
        }
    }

    const handleSaveMoodleCredentials = async (e) => {
        e.preventDefault()
        const result = await useSettingsStore.saveMoodleConfig(credentials)
        if (result.token) {
            toast({
                description: "Credentials saved successfully"
            })
            setButtonDisabled(true)
            setMoodleToken(result.token)
            setMoodleEndpoint(result.url)
        } else {
            toast({
                variant: "destructive",
                title: "Credentials not saved",
                description: "The credentials were not saved correctly. Try again. If there are problems, contact the application administrator."
            })
            setButtonDisabled(true)
        }
    }

    const handleSinkCoursesFromMoodle = async (e) => {
        e.preventDefault()
        const result = await useSettingsStore.syncMoodleData(session.user.id)
        if (result.success) {
            toast({
                description: "Sync successfully"
            })
        } else {
            toast({
                variant: "destructive",
                title: "Sync failled",
                description: "An error occured during synch..Please contact amministrator.."
            })
        }
    }


    const handleResetButton = (e) => {
        e.preventDefault()
        setUsername('')
        setPassword('')
        setToken('')
        setUrl('')
        setIsDisabled(false)
    }


    return (
        <>
            {/* Moodle settings */}
            <div className="border rounded-lg ml-2 mr-2 mt-5">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">Username</div>
                        <div className="text-gray-500">Set your moodle username</div>
                    </div>
                    <div className="w-6/12">
                        <Input
                            type="text"
                            value={username}
                            onChange={handleUsernameInputChange}
                            disabled={isDisabled}
                            placeholder="username" />
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">Password</div>
                        <div className="text-gray-500">Set your moodle password</div>
                    </div>
                    <div className="w-6/12">
                        <Input
                            type="password"
                            value={password}
                            onChange={handlePasswordInputChange}
                            disabled={isDisabled}
                            placeholder="password" />
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">Token</div>
                        <div className="text-gray-500">Set your moodle token</div>
                    </div>
                    <div className="w-6/12">
                        <Input
                            type="text"
                            value={moodleToken}
                            onChange={handleTokenInputChange}
                            disabled={isDisabled}
                            placeholder="token" />
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">Endpoint</div>
                        <div className="text-gray-500">Set your moodle endpoint</div>
                    </div>
                    <div className="w-6/12">
                        <Input
                            type="text"
                            value={moodleEndpoint}
                            onChange={handleUrlInputChange}
                            required
                            disabled={isDisabled}
                            placeholder="https://my-moodle-url.example.com" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">Test Moodle Connection</div>
                        <div className="text-gray-500">Check if your configured credential work properly</div>
                    </div>
                    <div>
                        {/* if check successfull open popup to confirm if user want to save or not*/}
                        {useSettingsStore.checkingMoodle ? (
                            <Button disabled className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Checking
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={handleCheckMoodleSettings} className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                Check
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b w-full">
                    <div className="text-center mx-auto mr-2">
                        {/* if check successfull open popup to confirm if user want to save or not*/}
                        {useSettingsStore.savingMoodle ? (
                            <Button disabled className="bg-green-100 hover:bg-green-200 dark:bg-gray-800 text-xl py-2 px-4">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Saving
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={handleSaveMoodleCredentials}
                                disabled={buttonDisabled}
                                className="bg-green-100 hover:bg-green-200 dark:bg-gray-800 text-xl py-2 px-4 w-36">
                                Save
                            </Button>
                        )}

                    </div>
                    <div className="text-center mx-auto">
                        {/* if check successfull open popup to confirm if user want to save or not*/}
                        {useSettingsStore.moodleInSync ? (
                            <Button disabled className="bg-green-100 hover:bg-green-200 dark:bg-gray-800 text-xl py-2 px-4">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> In sync..
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={handleSinkCoursesFromMoodle}
                                disabled={buttonDisabled}
                                className="bg-green-100 hover:bg-green-200 dark:bg-gray-800 text-xl py-2 px-4 w-36">
                                Sync
                            </Button>
                        )}

                    </div>
                    <div className="text-center mx-auto ml-2">
                        <Button
                            variant="ghost"
                            onClick={handleResetButton}
                            disabled={useSettingsStore.checkingMoodle || useSettingsStore.savingOpenai}
                            className="bg-red-100 hover:bg-red-200 dark:bg-gray-800 py-2 px-4 rounded-lg text-xl w-36"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </>

    )

}

export default MoodleSettings