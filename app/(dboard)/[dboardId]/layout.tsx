import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


export default async function DboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: {dboardId: string}
}) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

     const dashboard = await prismadb.dashboard.findFirst({
        where: {
            id: params.dboardId,
            userId
        }
     });

     if (!dashboard) {
        redirect('/');
     }

     return (
        <>
          <Navbar/>
          {children}
        </>
     )
}