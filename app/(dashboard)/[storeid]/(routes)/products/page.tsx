import { format } from "date-fns"

import prismabd from "@/lib/prismabd"
import { formatter } from "@/lib/utils"

import {ProductClient} from "./components/client"
import { ProductColumn } from "./components/columns"

const ProductsPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const products = await prismabd.product.findMany({
        // Finds all the products that match the storeId
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            model: true,
            memory: true
        },
        // Orders the products by newest first
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        model: item.model.name,
        memory: item.memory.name,
        // Reformating the date into a string with the date-fns npm library
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductsPage