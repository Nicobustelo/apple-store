import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismabd from "@/lib/prismabd";

const Navbar = async () => {
    const {userId} = auth()

    if(!userId){
        redirect("/sign-in")
    }

    const stores = await prismabd.store.findMany({
        where: {
            userId
        }
    })

    return ( 
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores}/>
                <MainNav className="mx-6"/>
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
     );
}
 
export default Navbar;