import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import DashboardSwitcher  from "@/components/dashboard-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
    const { userId } = auth();

    if (!userId){
        redirect("/sign-in");
    }

const dashboards = await prismadb.dashboard.findMany({
    where: {
        userId,
    }
})
    return ( 
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <DashboardSwitcher items={dashboards} />
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;