import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismabd";

export async function GET (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { memoryId: string } }
) {
    try {
        if(!params.memoryId) {
            return new NextResponse("Memory id is required", { status: 400 })
        }

        const memory = await prismabd.memory.findUnique({
            // Find the memory
            where: {
                id: params.memoryId,
            }
        })

        return NextResponse.json(memory)

    } catch (error) {
        console.log('[MEMORY_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH (
    // The data from the request the user made
    req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, memoryId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()
        // Gets the data from the request
        const body = await req.json()

        const { name, value } = body

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!name){
            return new NextResponse("Un nombre es requerido", { status: 400 })
        }

        if(!name){
            return new NextResponse("Es necesario un valor que identifique la memoria", { status: 400 })
        }

        if(!params.memoryId) {
            return new NextResponse("Model id is required", { status: 400 })
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

        const memory = await prismabd.memory.updateMany({
            // Find the memory
            where: {
                id: params.memoryId,
            },
            // Data that is going to be changed
            data: {
                name,
                value
            }
        })

        return NextResponse.json(memory)

    } catch (error) {
        console.log('[MEMORY_PATCH]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, memoryId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.memoryId) {
            return new NextResponse("Memory id is required", { status: 400 })
        }

        const storeByUserId = await prismabd.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            // User is loged in, but does not have the permission to modify or create the memory
            return new NextResponse("Unauthorized", {status: 403})
        }

        const memory = await prismabd.memory.deleteMany({
            // Find the memory
            where: {
                id: params.memoryId,
            }
        })

        return NextResponse.json(memory)

    } catch (error) {
        console.log('[MEMORY_DELETE]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}