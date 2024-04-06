import prismabd from "@/lib/prismabd"

interface DashboardPageProps {
    params: {storeid: string}
}

const DashboardPage : React.FC<DashboardPageProps> = async ({
    params
}) => {
    const store = await prismabd.store.findFirst({
        where: {
            id: params.storeid
        }
    })

    return(
        <div>
            Active Store: {store?.name}
        </div>
    )
}

export default DashboardPage