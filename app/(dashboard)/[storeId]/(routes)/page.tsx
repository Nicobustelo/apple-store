import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import prismabd from "@/lib/prismabd"
import { BookText, Images } from "lucide-react"

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
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Guía Rápida - Tutorial
                            </CardTitle>
                            <BookText className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                Configura tu tienda en 5 minutos
                            </div>
                        </CardContent>
                    </Card>
                    <a href="https://www.figma.com/design/uAffaztYWtFgUjjwGBQ6zp/Banners?node-id=0-1&node-type=CANVAS&t=JmiCfwtKmBUhzQHW-0">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Banners
                                </CardTitle>
                                <Images className="h-4 w-4 text-muted-foreground"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    Utiliza nuestros banners prediseñados
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
