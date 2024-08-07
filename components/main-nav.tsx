"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()
    const params = useParams()
    
    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Baners',
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categorías',
            active: pathname === `/${params.storeId}/categories`
        },
        // {
        //     href: `/${params.storeId}/models`,
        //     label: 'Modelos',
        //     active: pathname === `/${params.storeId}/models`
        // },
        // {
        //     href: `/${params.storeId}/memories`,
        //     label: 'Memoria',
        //     active: pathname === `/${params.storeId}/memories`
        // },
        {
            href: `/${params.storeId}/products`,
            label: 'Productos',
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Configuración',
            active: pathname === `/${params.storeId}/settings`
        }
    ]

    return(
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}