'use client'

import { SendIcon, Sparkles, UploadIcon } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatUploadDialog } from './ChatUploadDialog'
import { DialogContextType, useDialog } from '../context/DialogContext'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import ChatSuggestions from './ChatSuggestion'


const ChatFooter = ({ chatId, courseId, form, openaiCredential, handleSendMessage }) => {

    const { dialogs, openDialog, closeDialog } = useDialog() as DialogContextType

    return (
        <div className="p-4 border-t sticky">
            <div className="flex space-x-4">
                <Button
                    variant="ghost"
                    className="p-2 rounded-lg border-2 space-x-2 border-[#12b886]"
                    size='sm'
                    onClick={() => openDialog(`chatUploadDialog`)}
                >
                    <UploadIcon size={15} /> <p>Upload</p>
                </Button>
                <Sheet>
                    <SheetTrigger>
                        <Button
                            variant="ghost"
                            className="p-2 rounded-lg border-2 space-x-2 border-[#12b886]"
                            size='sm'
                        >
                            <Sparkles size={15} /> <p>suggestions</p>
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Suggestions</SheetTitle>
                            <SheetDescription>
                                <div className='w-full border-b border-[#12b886]'>
                                    <p className='mb-4'>This is a list of suggestions we have written for you based on our conversation.</p>
                                </div>
                                <ChatSuggestions chatId={chatId} openaiCredential={openaiCredential}/>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="flex flex-col mt-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSendMessage)}
                        className='flex justify-between border rounded-lg p-4 flex space-x-2 items-center w-full'
                    >
                        <FormField
                            control={form.control}
                            name="chat_message"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    {/*<FormLabel>Message</FormLabel>*/}
                                    <FormControl className='w-full'>
                                        <Textarea
                                            className="w-full p-2 rounded-md flex-grow border-none shadow-none resize-none"
                                            {...field}
                                            placeholder="Send a message" />
                                    </FormControl>
                                    {/*<FormDescription>
                                        You can <span>@mention</span> other users and organizations.
                                    </FormDescription>*/}
                                    <FormMessage />
                                </FormItem>
                            )}

                        />
                        <Button type='submit'
                            className="flex items-center rounded-md transition duration-300 self-end bg-[#12b886] hover:bg-[#0ca678]">
                            <SendIcon className="w-4 h-4 ml-1 mr-2" /> Send
                        </Button>
                    </form>
                </Form>
            </div>
            <ChatUploadDialog
                courseId={courseId as string}
                chatId={chatId as string}
                isOpen={dialogs['chatUploadDialog']}
                toogleDialog={() => closeDialog('chatUploadDialog')}
            />
        </div>
    )
}

export default ChatFooter
