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

        const { name, value } = body

        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name) {
                return new NextResponse("Un nombre es requerido", {status: 400})
        }

        if(!value) {
            return new NextResponse("Es necesario un valor que identifique el modelo", {status: 400})
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

        const model = await prismabd.model.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        })

        return NextResponse.json(model)
    } catch (error) {
        console.log('[MODELS_POST]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params:{storeId: string}}
) {
    try {
        if(!params.storeId){
            return new NextResponse("Store ID is required", {status: 400})
        }

        const models = await prismabd.model.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(models)
    } catch (error) {
        console.log('[MODELS_GET]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}