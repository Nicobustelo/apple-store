import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismabd from "@/lib/prismabd";

export async function GET (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { productId: string } }
) {
    try {
        if(!params.productId) {
            return new NextResponse("Product id is required", { status: 400 })
        }

        const product = await prismabd.product.findUnique({
            // Find the product
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                model: true,
                memory: true,
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH (
    // The data from the request the user made
    req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, billboardId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()
        // Gets the data from the request
        const body = await req.json()

        const { 
            name,
            price,
            categoryId,
            modelId,
            memoryId,
            images,
            isFeatured,
            isArchived
         } = body

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!images || !images.length){
            return new NextResponse("Images are required", {status: 400})
        }

        if(!price) {
            return new NextResponse("Price is required", {status: 400})
        }

        if(!categoryId) {
            return new NextResponse("Category id is required", {status: 400})
        }

        if(!modelId) {
            return new NextResponse("Model id is required", {status: 400})
        }

        if(!memoryId) {
            return new NextResponse("Memory id is required", {status: 400})
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
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

        const billboard = await prismabd.billboard.updateMany({
            // Find the billboard
            where: {
                id: params.billboardId,
            },
            // Data that is going to be changed
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE (
    // The data from the request the user made
    // It is not used tho, it is only here becuase the params can only be accesed on the second argument of this function
    _req: Request,
    // The params from the URL 
    {params} : { params : { storeId: string, billboardId: string } }
) {
    try {
        // Gets the userId from Clerk
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.billboardId) {
            return new NextResponse("Store id is required", { status: 400 })
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

        const billboard = await prismabd.billboard.deleteMany({
            // Find the billboard
            where: {
                id: params.billboardId,
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal Error", {status: 500})
    }
}