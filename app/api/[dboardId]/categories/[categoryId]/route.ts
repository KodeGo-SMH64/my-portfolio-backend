import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

//=============================GET ROUTE=====================================
export async function GET (
    req: Request,
    { params }: { params: {categoryId: string} }
) {
    try{
        const { userId } = auth();

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);

    }catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
};

//========================================PATCH ROUTE==================================
export async function PATCH (
    req: Request,
    { params }: { params: { dboardId: string, categoryId: string} }
) {
    try{
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        
        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }
        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);

    }catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
};

//================================DELETE ROUTE=====================================
export async function DELETE (
    req: Request,
    { params }: { params: {dboardId: string, categoryId: string} }
) {
    try{
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized Access", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);

    }catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal Error!", { status: 500 });
    }
};