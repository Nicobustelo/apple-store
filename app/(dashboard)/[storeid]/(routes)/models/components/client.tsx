"use client"

import { useParams, useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

import { ModelColumn, columns } from "./columns"

interface ModelClientProps {
    data: ModelColumn[]
}

export const ModelClient: React.FC<ModelClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Modelos (${data.length})`}
                    description="Configura los modelos de tu tienda"
                />
                <Button onClick={() => router.push(`/${params.storeId}/models/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Añadir
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="value" columns={columns} data={data}/>
        </>
    )
}

export default ModelClient