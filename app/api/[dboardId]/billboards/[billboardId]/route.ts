import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//=============================GET FUNCTION=====================================
export async function GET (
    req: Request,
    { params }: { params: {billboardId: string} }
) {
    try{
        const { userId } = auth();

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const billboard = await prismadb.billBoard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    }catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
};

//========================================PATCH FUNCTION==================================
export async function PATCH (
    req: Request,
    { params }: { params: { dboardId: string, billboardId: string} }
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }
        
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }
        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const dboardByUserId = await prismadb.dashboard.findFirst({
            where: {
                id: params.dboardId,
                userId
            }
        });
    
            if (!dboardByUserId) {
                return new NextResponse("Unauthorized" , {status: 403});
            }

        const billboard = await prismadb.billBoard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    }catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
};

//================================DELETE FUNCTION=====================================
export async function DELETE (
    req: Request,
    { params }: { params: {dboardId: string, billboardId: string} }
) {
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const dboardByUserId = await prismadb.dashboard.findFirst({
            where: {
                id: params.dboardId,
                userId
            }
        });
    
            if (!dboardByUserId) {
                return new NextResponse("Unauthorized" , {status: 403});
            }

        const billboard = await prismadb.billBoard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    }catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
};