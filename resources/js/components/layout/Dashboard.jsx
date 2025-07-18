import React from "react";

import { usePage, Link, router } from "@inertiajs/react";

import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

import {
    PackageIcon,
    HomeIcon,
    UserRoundIcon,
    SquareUser,
    LogOut,
    Mail,
    UsersRound,
    PackageOpenIcon,
} from "lucide-react";

import { Button } from "@components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";

import {
    Sidebar,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter,
} from "@/components/ui/sidebar";

import { Separator } from "@components/ui/separator";

import TenantSwitcher from "@components/custom/TenantSwitcher";

const iconMap = {
    PackageIcon: PackageIcon,
    HomeIcon: HomeIcon,
    UserRoundIcon: UserRoundIcon,
    PackageOpenIcon: PackageOpenIcon,
};

import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";

export default function Dashboard({ children }) {
    const { moduleMenus, tenants, currentTenantId, user } = usePage().props;

    const { url, component } = usePage();
    const currentPath = url;
    const isHomeActive = currentPath === "/dashboard";

    return (
        <SidebarProvider>
            <Sidebar variant="inset">
                <SidebarHeader>
                    <TenantSwitcher
                        tenants={tenants}
                        currentTenantId={currentTenantId}
                    />
                </SidebarHeader>
                <SidebarContent className="flex flex-col justify-between">
                    <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarMenu>
                            <Link
                                href="/dashboard"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                    isHomeActive
                                        ? "bg-gray-100 text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-gray-50"
                                }`}
                            >
                                <HomeIcon className="h-4 w-4" />
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip="Home"
                                    ></SidebarMenuButton>
                                    Home
                                </SidebarMenuItem>
                            </Link>
                            {moduleMenus.map((menu, idx) => {
                                const Icon = iconMap[menu.icon] || HomeIcon;

                                const isActive = currentPath.startsWith(
                                    menu.route
                                );
                                return (
                                    <Link
                                        key={idx}
                                        href={menu.route}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                            isActive
                                                ? "bg-gray-100 text-gray-900 dark:text-white"
                                                : "text-gray-500 dark:text-gray-50"
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={menu.title}
                                            ></SidebarMenuButton>
                                            {menu.title}
                                        </SidebarMenuItem>
                                    </Link>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem key="inbox">
                                    <SidebarMenuButton asChild size="sm">
                                        <Link href="/dashboard/employees/inbox">
                                            <Mail />
                                            <span>Inbox</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem key="organization">
                                    <SidebarMenuButton asChild size="sm">
                                        <Link href="/dashboard/tenant">
                                            <UsersRound />
                                            <span>Organization</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <Popover className="w-full">
                        <PopoverTrigger
                            className="w-full bg-secondary h-12"
                            asChild
                        >
                            <div className="flex justify-start items-center gap-2 p-2 border bg-white rounded-2xl shadow-sm hover:bg-accent cursor-pointer">
                                <Avatar className="rounded-lg">
                                    <AvatarImage src={`/storage/${user.picture}`} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className="font-medium">{user.name}</h1>

                            </div>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="p-2">
                            <div className="flex flex-col space-y-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard/profile">
                                        <SquareUser />
                                        Profile
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => router.post("/logout")}
                                >
                                    <LogOut />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <DynamicBreadcrumbs />
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
