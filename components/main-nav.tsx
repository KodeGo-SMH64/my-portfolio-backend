"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";


export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.dboardId}`,
            label: 'Home',
            active: pathname === `/${params.dboardId}`,
        },
        {
            href: `/${params.dboardId}/billboards`, 
            label: 'Billboards',
            active: pathname === `/${params.dboardId}/billboards`,
        },
        {
            href: `/${params.dboardId}/categories`, 
            label: 'Categories',
            active: pathname === `/${params.dboardId}/categories`,
        },
        {
            href: `/${params.dboardId}/settings`, //SETTINGS FOR THE SPECIFIC OR ACTIVE DASHBOARD THAT WAS SELECTED IN THE SWITCHER
            label: 'Settings',
            active: pathname === `/${params.dboardId}/settings`,
        },
    ];

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6 ", className)}
        >
            {routes.map((route) => (
                <Link
                key={route.href}
                href={route.href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-black dark:text-white" : "text-muted-foreground"
                )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )    
};