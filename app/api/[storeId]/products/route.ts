import prismabd from "@/lib/prismabd"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    {params} : {params:{storeId: string}}
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { 
            name,
            price,
            categoryId,
            images,
            isFeatured,
            isArchived,
            subcategoryValueIds
         } = body

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
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

        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400})
        }

        const storeByUserId = await prismabd.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            // User is loged in, but does not have the permission to modify or create the product
            return new NextResponse("Unauthorized", {status: 403})
        }

        const product = await prismabd.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                },
                subcategoryValueIds: subcategoryValueIds || null,
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCTS_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET(  // Va a estar muy dificil esto hno
    req: Request,
    {params} : {params:{storeId: string}}
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const modelId = searchParams.get("modelId") || undefined;
        const memoryId = searchParams.get("memoryId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400})
        }

        const products = await prismabd.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products)
    } catch (error) {
        console.log('[PRODUCTS_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}