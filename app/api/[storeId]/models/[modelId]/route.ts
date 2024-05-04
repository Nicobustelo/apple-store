import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismabd";

export async function GET (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { modelId: string } }
) {
    try {
        if(!params.modelId) {
            return new NextResponse("Model id is required", { status: 400 })
        }

        const model = await prismabd.model.findUnique({
            // Find the model
            where: {
                id: params.modelId,
            }
        })

        return NextResponse.json(model)

    } catch (error) {
        console.log('[MODEL_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH (
    // The data from the request the user made
    req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, modelId: string } }
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
            return new NextResponse("Es necesario un valor que identifique el modelo", { status: 400 })
        }

        if(!params.modelId) {
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

        const model = await prismabd.model.updateMany({
            // Find the model
            where: {
                id: params.modelId,
            },
            // Data that is going to be changed
            data: {
                name,
                value
            }
        })

        return NextResponse.json(model)

    } catch (error) {
        console.log('[MODEL_PATCH]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, modelId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.modelId) {
            return new NextResponse("Model id is required", { status: 400 })
        }

        const storeByUserId = await prismabd.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            // User is loged in, but does not have the permission to modify or create the model
            return new NextResponse("Unauthorized", {status: 403})
        }

        const model = await prismabd.model.deleteMany({
            // Find the model
            where: {
                id: params.modelId,
            }
        })

        return NextResponse.json(model)

    } catch (error) {
        console.log('[MODEL_DELETE]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}