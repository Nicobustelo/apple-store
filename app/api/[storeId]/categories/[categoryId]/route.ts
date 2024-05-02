import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismabd";

export async function GET (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { categoryId: string } }
) {
    try {
        if(!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        const category = await prismabd.category.findUnique({
            // Find the category
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH (
    // The data from the request the user made
    req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, categoryId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()
        // Gets the data from the request
        const body = await req.json()

        const {name, billboardId} = body

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!name){
            return new NextResponse("Un nombre es requerido", { status: 400 })
        }

        if(!billboardId){
            return new NextResponse("Es necesario elegir un baner", { status: 400 })
        }

        if(!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        const storeByUserId = await prismabd.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            // User is loged in, but does not have the permission to modify or create the billboard
            return new NextResponse("Unauthorized", {status: 403})
        }

        const category = await prismabd.category.updateMany({
            // Find the category
            where: {
                id: params.categoryId,
            },
            // Data that is going to be changed
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, categoryId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        const storeByUserId = await prismabd.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            // User is loged in, but does not have the permission to modify or create the billboard
            return new NextResponse("Unauthorized", {status: 403})
        }

        const category = await prismabd.category.deleteMany({
            // Find the category
            where: {
                id: params.categoryId,
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}