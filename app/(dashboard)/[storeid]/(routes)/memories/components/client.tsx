"use client"

import { useParams, useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

import { MemoryColumn, columns } from "./columns"

interface MemoryClientProps {
    data: MemoryColumn[]
}

export const MemoryClient: React.FC<MemoryClientProps> = ({
    data
}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Memoria (${data.length})`}
                    description="Configura las memorias de tu equipos"
                />
                <Button onClick={() => router.push(`/${params.storeId}/memories/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Añadir
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="value" columns={columns} data={data}/>
        </>
    )
}

export default MemoryClient