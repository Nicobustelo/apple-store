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

        const { label, imageUrl } = body

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400})
        }

        if(!imageUrl) {
            return new NextResponse("Image URL is required", {status: 400})
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
            // User is loged in, but does not have the permission to modify or create the billboard
            return new NextResponse("Unauthorized", {status: 403})
        }

        const billboard = await prismabd.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params:{storeId: string}}
) {
    // Add CORS headers
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');

    try {
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400})
        }

        const billboards = await prismabd.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboards, { headers })
    } catch (error) {
        console.log('[BILLBOARDS_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}