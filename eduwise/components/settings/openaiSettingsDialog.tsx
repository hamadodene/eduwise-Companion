import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { openai } from "@/lib/store-settings"
import { useSettingsStore } from "@/lib/store-settings"

const OpenaiSettingsDialog = ({ isDialogOpen, setIsDialogOpen, credentials, setSaveSuccessfully }:
    {
        isDialogOpen: boolean,
        setIsDialogOpen: (isDialogOpen: boolean) => void,
        credentials: openai,
        setSaveSuccessfully: (isSaveSuccessfully: boolean) => void
    }) => {


    const handleSaveOpenAiCredentials = async (e) => {
        e.preventDefault()
        const result = await useSettingsStore.saveOpenAIConfig(credentials)

        if (result.apiKey) {
            setSaveSuccessfully(true)
        } else {
            setSaveSuccessfully(false)
        }

        setIsDialogOpen(false)
    }

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to save your credentials?</AlertDialogTitle>
                    <AlertDialogDescription>
                        After some checks, we have confirmed that the credentials you provided are correct. Would you like to proceed with the saving process?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSaveOpenAiCredentials}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OpenaiSettingsDialog