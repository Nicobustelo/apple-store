import prismabd from "@/lib/prismabd"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name } = body

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        const store = await prismabd.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log('[STORES_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

// GET stores endopint - Get all stores
export async function GET(
    req: Request,
) {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');

    try {
        const { userId } = auth()

        const stores = await prismabd.store.findMany({
            where: {}
        })

        return NextResponse.json(stores)
    } catch (error) {
        console.log('[STORES_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}