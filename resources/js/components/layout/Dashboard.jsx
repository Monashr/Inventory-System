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
    ChevronDown,
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

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@components/ui/collapsible";

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
                <Separator />
                <SidebarContent className="flex flex-col justify-between">
                    <SidebarGroup>
                        <SidebarMenu>
                            {/* Home */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentPath === "/dashboard"}
                                    className="cursor-pointer"
                                >
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 w-full"
                                    >
                                        <HomeIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">
                                            Home
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Dynamic Menus */}
                            {moduleMenus.map((menu, idx) => {
                                const Icon = iconMap[menu.icon] || HomeIcon;
                                const isParentActive = currentPath.startsWith(
                                    menu.route
                                );
                                const hasChildren =
                                    Array.isArray(menu.children) &&
                                    menu.children.length > 0;

                                if (hasChildren) {
                                    return (
                                        <Collapsible
                                            key={idx}
                                            defaultOpen={isParentActive}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <div
                                                    className={`flex items-center justify-between w-full px-2 py-2 rounded-lg cursor-pointer transition-all hover:text-primary hover:bg-accent`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4" />
                                                        <span className="text-sm font-medium">
                                                            {menu.title}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="ml-6 mt-1 flex flex-col gap-1">
                                                {menu.children.map(
                                                    (child, cidx) => {
                                                        const isActive =
                                                            currentPath.startsWith(
                                                                child.route
                                                            );
                                                        return (
                                                            <SidebarMenuItem
                                                                key={cidx}
                                                            >
                                                                <SidebarMenuButton
                                                                    isActive={
                                                                        isActive
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={
                                                                            child.route
                                                                        }
                                                                        className={`px-3 py-1 rounded-md text-sm transition w-full`}
                                                                    >
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        );
                                                    }
                                                )}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                }

                                const isActive = currentPath.startsWith(
                                    menu.route
                                );
                                return (
                                    <SidebarMenuItem key={idx}>
                                        <SidebarMenuButton isActive={isActive}>
                                            <Link
                                                href={menu.route}
                                                className={`flex items-center gap-3 rounded-lg py-2 transition-all w-full`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="text-sm font-medium">
                                                    {menu.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <Separator />
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem key="inbox">
                            <SidebarMenuButton asChild size="sm">
                                <Link href="/dashboard/inbox">
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
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex px-4 h-16 shrink-0 items-center gap-2">
                    <div className="flex justify-start items-center gap-2 flex-1">
                        <SidebarTrigger className="-ml-1" />
                        <DynamicBreadcrumbs />
                    </div>
                    <Popover>
                        <PopoverTrigger className="bg-secondary h-12" asChild>
                            <div className="flex justify-start items-center gap-2 p-2 border bg-white rounded-2xl shadow-sm hover:bg-accent cursor-pointer">
                                <Avatar className="rounded-lg">
                                    <AvatarImage
                                        src={`/storage/${user.picture}`}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className="font-medium">{user.name}</h1>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="p-2">
                            <div className="flex flex-col justify-center items-center space-y-2">
                                <p>{user.email}</p>
                                <Avatar className="w-16 h-16 rounded-lg">
                                    <AvatarImage
                                        src={`/storage/${user.picture}`}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className="font-bold">{user.name}</h1>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    size="sm"
                                >
                                    <Link href="/dashboard/profile" className="flex gap-2 justify-center items-center">
                                        <SquareUser />
                                        Profile
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    className="cursor-pointer w-full"
                                    onClick={() => router.post("/logout")}
                                >
                                    <LogOut />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
