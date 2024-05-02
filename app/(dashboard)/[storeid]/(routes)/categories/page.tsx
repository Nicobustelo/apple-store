import { format } from "date-fns"

import prismabd from "@/lib/prismabd"

import { CategoryClient } from "./components/client"
import { CategoryColumn } from "./components/columns"

const CategoriesPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const categories = await prismabd.category.findMany({
        // Finds all the categories that match the storeId
        where: {
            storeId: params.storeId
        },
        include:{
            billboard: true
        },
        // Orders the categories by newest first
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        // Reformating the date into a string with the date-fns npm library
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
    )
}

export default CategoriesPage