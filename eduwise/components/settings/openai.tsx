'use client'

import React, { useCallback, useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { checkResponse, useSettingsStore } from "@/lib/settings/store-settings"
import { openai } from "@/lib/settings/store-settings"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalSettingsStore } from "@/lib/settings/local-settings-store"

const OpenaiSettings = () => {

    const [token, setToken] = useState('')
    const [organizzationId, setOrganizzationId] = useState('')
    const [model, setModel] = useState('gpt-3.5-turbo')
    const [checkStatus, setCheckStatus] = useState<checkResponse>({
        status: '',
        message: '',
        success: false
    })

    const [credentials, setCredentials] = useState<openai>({
        apiKey: '',
        apiOrganizationId: '',
        model: '',
        userId: ''
    })

    const [isDisabled, setIsDisabled] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const { toast } = useToast()
    const { apiKey, apiOrganizationId, gptModel, setApiKey, setApiOrganizationId, setGtpModel } = useLocalSettingsStore.getState()

    const { data: session } = useSession({
        required: true
    })

    const handleTokenInputChange = event => {
        setToken(event.target.value)
    }

    const handleOnganizzationIdInputChange = event => {
        setOrganizzationId(event.target.value)
    }

    const handleModelSelectorChange = event => {
        setModel(event)
    }

    const handleLoadOpenaiCredentials = useCallback(async () => {
        if (session) {
            if (!apiKey || !apiOrganizationId || !gptModel) {
                const result = await useSettingsStore.loadOpenAIConfig(session.user.id)
                setApiKey(result.apiKey)
                setApiOrganizationId(result.apiOrganizationId)
                setGtpModel(result.model)
                setToken(result.apiKey)
                setOrganizzationId(result.apiOrganizationId)
                setModel(result.model)
            }
            setToken(apiKey)
            setOrganizzationId(apiOrganizationId)
            setModel(gptModel)
        }
    }, [session])

    useEffect(() => {
        handleLoadOpenaiCredentials()
    }, [session])

    const handleCheckOpenAiSettings = async (e) => {
        e.preventDefault()
        setIsDisabled(true)
        const config: openai = {
            apiKey: token,
            apiOrganizationId: organizzationId
        }
        const result = await useSettingsStore.checkOpenAiCredential(config)

        setCheckStatus({
            ...checkStatus,
            success: result.success,
            status: result.status,
            message: result.message
        })

        if (result.status == "200") {

            setCredentials({
                apiKey: token,
                apiOrganizationId: organizzationId,
                model: model,
                userId: session.user.id
            })
            setButtonDisabled(false)
            toast({
                title: "Credentials are valid ",
                description: "You can save your credentials if you want."
            })
        } else {
            setButtonDisabled(true)
            toast({
                variant: "destructive",
                title: "Credentials are not valid ",
                description: "Please check. Token or organization id may not be valid."
            })
        }
    }

    const handleSaveOpenAiCredentials = async (e) => {
        e.preventDefault()
        const result = await useSettingsStore.saveOpenAIConfig(credentials)

        if (result.apiKey) {
            toast({
                description: "Credentials saved successfully"
            })
            setButtonDisabled(true)
            setApiKey(result.apiKey)
            setApiOrganizationId(result.apiOrganizationId)
        } else {
            toast({
                variant: "destructive",
                title: "Credentials not saved",
                description: "The credentials were not saved correctly. Try again. If there are problems, contact the application administrator."
            })
            setButtonDisabled(true)
        }
    }

    const handleResetButton = (e) => {
        e.preventDefault()
        setToken('')
        setOrganizzationId('')
        setModel('gpt-3.5-turbo')
        setIsDisabled(false)
    }


    return (
        <>
            {/* GPT settings */}
            < div className="rounded-lg ml-2 mr-2" >
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="font-semibold">GPT model</div>
                    </div>
                    <div>
                        <Select onValueChange={handleModelSelectorChange} defaultValue={gptModel}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="gpt-3.5-turbo" />
                            </SelectTrigger>
                            <SelectContent onChange={handleModelSelectorChange}>
                                <SelectGroup>
                                    <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                                    <SelectItem value="gpt-4">gpt-4</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="font-semibold">OpenAi token</div>
                    </div>
                    <div className="w-6/12">
                        <Input
                            type="text"
                            placeholder="Openai token"
                            value={apiKey}
                            onChange={handleTokenInputChange}
                            required
                            disabled={isDisabled}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="font-semibold">OpenAI organizzation id</div>
                    </div>
                    <div className="w-6/12">
                        <Input
                            type="text"
                            placeholder="Openai organizzation id"
                            value={apiOrganizationId}
                            onChange={handleOnganizzationIdInputChange}
                            required
                            disabled={isDisabled}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="font-semibold">Test OpenAI connection</div>
                        <div className="text-gray-500 text-sm">Check if your configured credential work properly</div>
                    </div>
                    <div>
                        {/* if check successfull open popup to confirm if user want to save or not*/}
                        {useSettingsStore.checkingOpenai ? (
                            <Button disabled className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Checking
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={handleCheckOpenAiSettings} className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                Check
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 mt-2 w-full">
                    <div className="text-center mx-auto mr-2">
                        {/* if check successfull open popup to confirm if user want to save or not*/}
                        {useSettingsStore.savingOpenai ? (
                            <Button disabled className="bg-green-100 hover:bg-green-200 dark:bg-gray-800 py-2 px-4">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Saving
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                disabled={buttonDisabled}
                                onClick={handleSaveOpenAiCredentials}
                                className="bg-green-100 hover:bg-green-200 dark:bg-gray-800 py-2 px-4 w-36">
                                Save
                            </Button>
                        )}

                    </div>
                    <div className="text-center mx-auto ml-2">
                        <Button
                            variant="ghost"
                            onClick={handleResetButton}
                            disabled={useSettingsStore.checkingOpenai || useSettingsStore.savingOpenai}
                            className="bg-red-100 hover:bg-red-200 dark:bg-gray-800 py-2 px-4 rounded-lg w-36"
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OpenaiSettings