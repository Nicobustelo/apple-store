import prismabd from "@/lib/prismabd";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    // The data from the request the user made
    req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()
        // Gets the data from the request
        const body = await req.json()

        const {name} = body

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!name){
            return new NextResponse("Name is required", { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const store = await prismabd.store.updateMany({
            // Find the store
            where: {
                id: params.storeId,
                userId
            },
            // Data that is going to be changed
            data: {
                name
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const store = await prismabd.store.deleteMany({
            // Find the store
            where: {
                id: params.storeId,
                userId
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}