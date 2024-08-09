"use client"

import { useParams, useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

import { ProductColumn, columns } from "./columns"

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Productos (${data.length})`}
                    description="Configura los productos de tu tienda"
                />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Nuevo Producto
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
        </>
    )
}

export default ProductClient