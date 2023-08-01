
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function POST(
    req: Request,
    {params} : {params: {dboardId: string}}
) {
    try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;
        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401});
        }
        
        if (!label) {
            return new NextResponse ("Label is required", {status: 400});
        }
        
        if (!imageUrl) {
            return new NextResponse ("Image URL is required", {status: 400});
        }

        if (!params.dboardId) {
            return new NextResponse ("Dashboard ID  is required", {status: 400});
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

    const billboard = await prismadb.billBoard.create({
        data: {
            label,
            imageUrl,
            dboardId: params.dboardId
        }
    });

    return NextResponse.json(billboard);
    }catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse ("Internal error", { status: 500});
    }
};


export async function GET(
    req: Request,
    {params} : {params: {dboardId: string}}
) {
    try {
   
        if (!params.dboardId) {
            return new NextResponse ("Dashboard ID  is required", {status: 400});
        }

    const billboards = await prismadb.billBoard.findMany({
        where: {
            dboardId: params.dboardId,
        },
    });

    return NextResponse.json(billboards);
    }catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse ("Internal error", { status: 500});
    }
};