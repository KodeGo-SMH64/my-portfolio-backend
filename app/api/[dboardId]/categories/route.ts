import { Category } from '@prisma/client';

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

    const { name, billboardId } = body;
        if (!userId) {
            return new NextResponse ("Unauthenticated", {status: 401});
        }
        
        if (!name) {
            return new NextResponse ("Name is required", {status: 400});
        }
        
        if (!billboardId) {
            return new NextResponse ("Billboard ID is required", {status: 400});
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

    const category = await prismadb.category.create({
        data: {
            name,
            billboardId,
            dboardId: params.dboardId
        }
    });

    return NextResponse.json(category);
    }catch (error) {
        console.log('[CATEGORIES_POST]', error);
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

    const categories = await prismadb.category.findMany({
        where: {
            dboardId: params.dboardId,
        },
    });

    return NextResponse.json(categories);
    }catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse ("Internal error", { status: 500});
    }
};