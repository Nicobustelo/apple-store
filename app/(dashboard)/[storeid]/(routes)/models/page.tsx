import { format } from "date-fns"

import prismabd from "@/lib/prismabd"

import { ModelClient } from "./components/client"
import { ModelColumn } from "./components/columns"

const ModelsPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const models = await prismabd.model.findMany({
        // Finds all the models that match the storeId
        where: {
            storeId: params.storeId
        },
        // Orders the models by newest first
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedModels: ModelColumn[] = models.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        // Reformating the date into a string with the date-fns npm library
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                < ModelClient data={formattedModels}/>
            </div>
        </div>
    )
}

export default ModelsPage