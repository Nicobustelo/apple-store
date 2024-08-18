import prismabd from "@/lib/prismabd"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    {params} : {params:{storeId: string, categoryId: string}}
) {
    // Add CORS headers
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');

    try {
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400})
        }

        const subcategories = await prismabd.subcategory.findMany({
            where: {
                categoryId: params.categoryId,
            },
            select: {
                id: true,
                name: true,
                values: {
                    select: {
                        id: true,
                        value: true
                    }
                }
            }
        });

        return NextResponse.json(subcategories, { headers })
    } catch (error) {
        console.log('[SUBCATEGORIES_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}