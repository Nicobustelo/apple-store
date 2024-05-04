import { format } from "date-fns"

import prismabd from "@/lib/prismabd"

import { MemoryClient } from "./components/client"
import { MemoryColumn } from "./components/columns"

const MemoriesPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const memories = await prismabd.memory.findMany({
        // Finds all the memories that match the storeId
        where: {
            storeId: params.storeId
        },
        // Orders the memories by newest first
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedMemories: MemoryColumn[] = memories.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        // Reformating the date into a string with the date-fns npm library
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                < MemoryClient data={formattedMemories}/>
            </div>
        </div>
    )
}

export default MemoriesPage