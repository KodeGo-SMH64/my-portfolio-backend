import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//=============================CREATING/PATCH FUNCTION=====================================
export async function PATCH (
    req: Request,
    { params }: { params: {dboardId: string} }
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.dboardId) {
            return new NextResponse("Dboard ID is required", { status: 400 });
        }

        const dashboard = await prismadb.dashboard.updateMany({
            where: {
                id: params.dboardId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(dashboard);

    }catch (error) {
        console.log('[DASHBOARD_PATCH]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
}

//================================DELETE FUNCTION=====================================
export async function DELETE (
    req: Request,
    { params }: { params: {dboardId: string} }
) {
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        if (!params.dboardId) {
            return new NextResponse("Dboard ID is required", { status: 400 });
        }

        const dashboard = await prismadb.dashboard.deleteMany({
            where: {
                id: params.dboardId,
                userId
            }
        });

        return NextResponse.json(dashboard);

    }catch (error) {
        console.log('[DASHBOARD_DELETE]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
}