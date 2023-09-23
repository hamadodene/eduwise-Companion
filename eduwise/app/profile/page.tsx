import { AppLayout } from "@/components/layouts/app-layout";
import { ProfileForm } from "@/components/profile";

export default function page() {
    return(
        <AppLayout>
            <ProfileForm></ProfileForm>
        </AppLayout>
    )
}