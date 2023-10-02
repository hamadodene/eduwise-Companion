// Contenuto.js
import { CogIcon, SendIcon, Settings, Settings2Icon, SettingsIcon, UploadIcon } from 'lucide-react';
import React from 'react';
import { ModeToggle } from './mode-toogle';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const Content = () => {
    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex space-x-4">
                <Button
                    variant="ghost"
                    className="p-2 rounded-lg border-2"
                    title='Settings'
                    size='sm'
                >
                    <Settings2Icon size={15}/>
                </Button>
                <ModeToggle />
                <Button
                    variant="ghost"
                    className="p-2 rounded-lg border-2"
                    size='sm'>
                    <UploadIcon size={15}/>
                </Button>
            </div>
            <div className="flex flex-col mt-4">
                <div className="flex justify-between border rounded-lg p-4 flex space-x-2 items-center">
                    <Textarea className="p-2 rounded-md flex-grow border-none shadow-none" placeholder="Inserisci il testo"></Textarea>
                    <Button className="flex items-center rounded-md transition duration-300 self-end bg-sky-400 hover:bg-sky-500">
                        <SendIcon className="w-4 h-4 ml-1 mr-2" /> Send
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default Content;
