'use client'

import React, { useState } from "react"
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
import { checkResponse, useSettingsStore } from "@/lib/store-settings"
import { openai } from "@/lib/store-settings"
import { ReloadIcon } from "@radix-ui/react-icons"

const OpenaiSettings = () => {

    const [token, setToken] = useState('')
    const [organizzationId, setOrganizzationId] = useState('')
    const [model, setModel] = useState('gpt-3.5-turbo')
    const [checkStatus, setCheckStatus] = useState<checkResponse>({
        status: '',
        message: '',
        success: false
    })

    const handleTokenInputChange = event => {
        setToken(event.target.value)
        // only debug, to remove
        console.log('value is:', event.target.value)
    }

    const handleOnganizzationIdInputChange = event => {
        setOrganizzationId(event.target.value)
        // only debug, to remove
        console.log('value is:', event.target.value)
    }

    const handleModelSelectorChange = event => {
        setModel(event)
        // only debug, to remove
        console.log('value is:', event)
    }

    const handleCheckOpenAiSettings = async (e) => {
        e.preventDefault()
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

        console.log("check status " + checkStatus.message)
    }

    return (
        <>
            {/* GPT settings */}
            < div className="border rounded-lg ml-2 mr-2" >
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">GPT model</div>
                        <div className="text-gray-500">Select the model you want to use as default</div>
                    </div>
                    <div>
                        <Select onValueChange={handleModelSelectorChange} defaultValue={model}>
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
                        <div className="text-lg font-semibold">OPENAI token</div>
                        <div className="text-gray-500">Set your custom openai token</div>
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Openai token"
                            value={token}
                            onChange={handleTokenInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">OPENAI organizzation id</div>
                        <div className="text-gray-500">Set openai organizzation id</div>
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Openai organizzation id"
                            value={organizzationId}
                            onChange={handleOnganizzationIdInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <div className="text-lg font-semibold">Test OpenAI connection</div>
                        <div className="text-gray-500">Check if your configured credential work properly</div>
                    </div>
                    <div>
                        {/* if check successfull open popup to confirm if user want to save or not*/}
                        {useSettingsStore.checking ? (
                            <Button disabled className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Check
                            </Button>
                        ) : (
                            <Button variant="ghost" onClick={handleCheckOpenAiSettings} className="bg-green-100 hover:bg-green-200 dark:bg-gray-800">
                                Check
                            </Button>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}

export default OpenaiSettings