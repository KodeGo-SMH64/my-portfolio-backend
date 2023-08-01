import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps{
    params: {
        dboardId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const dashboard = await prismadb.dashboard.findFirst({
        where: {
            id: params.dboardId,
            userId
        }
    });

    if (!dashboard) {
        redirect("/");
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={dashboard}/>
            </div>
        </div>
     );
}
 
export default SettingsPage;