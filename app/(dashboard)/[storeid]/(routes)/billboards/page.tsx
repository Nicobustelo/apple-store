import { format } from "date-fns"

import prismabd from "@/lib/prismabd"

import {BillboardClient} from "./components/client"
import { BillboardColumn } from "./components/columns"

const BillboardsPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const billboards = await prismabd.billboard.findMany({
        // Finds all the billboards that match the storeId
        where: {
            storeId: params.storeId
        },
        // Orders the billboards by newest first
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        // Reformating the date into a string with the date-fns npm library
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage