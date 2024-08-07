import { Card, CardHeader } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import prismabd from "@/lib/prismabd"

interface DashboardPageProps {
    params: {storeId: string}
}

const DashboardPage : React.FC<DashboardPageProps> = async ({
    params
}) => {
    const store = await prismabd.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title={`Bienvenido a ${store?.name}`} description="Configura cualquier parte de tu tienda desde nuestro panel de adminitración"/>
                <Separator />
            </div>
        </div>
    )
}

export default DashboardPage