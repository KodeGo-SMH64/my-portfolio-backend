import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function SetupLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    // const billboard = await prismadb.billBoard - ***TEST PRISMA if it exist here***

    const dashboard = await prismadb.dashboard.findFirst({
        where: {
            userId
        }
    });

    if (dashboard) {
        redirect(`/${dashboard.id}`);
    }

    return (
        <>
            {children}
        </>
    )
}