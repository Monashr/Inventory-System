import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import TenantSwitcher from "@components/custom/TenantSwitcher";
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
    Sun,
    Moon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { Toaster } from "@components/ui/sonner";
import { Button } from "@components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@components/ui/collapsible";
import { Separator } from "@components/ui/separator";
import { cn } from "../lib/utils";
import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";

const iconMap = {
    PackageIcon: PackageIcon,
    HomeIcon: HomeIcon,
    UserRoundIcon: UserRoundIcon,
    PackageOpenIcon: PackageOpenIcon,
};

export default function Dashboard({ children }) {
    const { moduleMenus, tenants, currentTenantId, user } = usePage().props;

    const { url } = usePage();

    const currentPath = url;
    
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
    }, []);

    function toggleDarkMode() {
        document.documentElement.classList.toggle("dark");
        setIsDarkMode(!isDarkMode);
    }

    const getUserInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <SidebarProvider>
            <Sidebar variant="inset" className="border-r border-border/40">
                <SidebarHeader className="border-b border-border/40 p-4">
                    <div className="space-y-4">
                        <TenantSwitcher
                            tenants={tenants}
                            currentTenantId={currentTenantId}
                        />
                    </div>
                </SidebarHeader>

                <SidebarContent className="px-2">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={currentPath === "/dashboard"}
                                    className="h-9 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50"
                                >
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3"
                                    >
                                        <HomeIcon className="h-4 w-4" />
                                        <span className="font-medium">
                                            Dashboard
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

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
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={
                                                            "h-9 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50 cursor-pointer"
                                                        }
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                        <span className="font-medium">
                                                            {menu.title}
                                                        </span>
                                                        <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="ml-4 mt-1 border-l border-border/40 pl-4 cursor-pointer">
                                                        {menu.children.map(
                                                            (child, cidx) => {
                                                                const isActive =
                                                                    currentPath.startsWith(
                                                                        child.route
                                                                    );
                                                                return (
                                                                    <SidebarMenuSubItem
                                                                        key={
                                                                            cidx
                                                                        }
                                                                    >
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={
                                                                                isActive
                                                                            }
                                                                            className="h-8 px-3 rounded-md transition-all duration-200"
                                                                        >
                                                                            <Link
                                                                                href={
                                                                                    child.route
                                                                                }
                                                                            >
                                                                                <span className="text-sm">
                                                                                    {
                                                                                        child.title
                                                                                    }
                                                                                </span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                );
                                                            }
                                                        )}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                const isActive = currentPath.startsWith(
                                    menu.route
                                );
                                return (
                                    <SidebarMenuItem key={idx}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className="h-9 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50"
                                        >
                                            <Link
                                                href={menu.route}
                                                className="flex items-center gap-3"
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span className="font-medium">
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

                <SidebarFooter className="border-t border-border/40 p-2">
                    <SidebarMenu className="space-y-1">
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                size="sm"
                                className="h-8 px-3 rounded-lg"
                            >
                                <Link
                                    href="/dashboard/inbox"
                                    className="flex items-center gap-3"
                                >
                                    <Mail className="h-4 w-4" />
                                    <span className="text-sm">Inbox</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                size="sm"
                                className="h-8 px-3 rounded-lg"
                            >
                                <Link
                                    href="/dashboard/tenant"
                                    className="flex items-center gap-3"
                                >
                                    <UsersRound className="h-4 w-4" />
                                    <span className="text-sm">
                                        Organization
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="flex flex-col">
                <div className="flex flex-col min-h-screen rounded-3xl h-full bg-radial from-secondary to-bg-card">
                    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-3xl">
                        <div className="flex h-16 items-center gap-4 px-6">
                            <div className="flex items-center gap-2 flex-1">
                                <SidebarTrigger className="-ml-1 h-8 w-8 cursor-pointer" />
                                <Separator
                                    orientation="vertical"
                                    className="h-6"
                                />
                                <DynamicBreadcrumbs />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleDarkMode}
                                    className="h-8 w-8 p-0 cursor-pointer"
                                >
                                    {isDarkMode ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                        Toggle theme
                                    </span>
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-10 px-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-7 w-7 rounded-lg">
                                                    <AvatarImage
                                                        src={`/storage/${user.picture}`}
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback className="rounded-lg text-xs font-medium">
                                                        {getUserInitials(
                                                            user.name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="hidden md:flex flex-col items-start">
                                                    <span className="text-sm font-medium leading-none">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground leading-none mt-0.5">
                                                        {user.email.length > 20
                                                            ? `${user.email.substring(
                                                                  0,
                                                                  20
                                                              )}...`
                                                            : user.email}
                                                    </span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-64 p-2"
                                    >
                                        <DropdownMenuLabel className="p-0">
                                            <div className="flex items-center gap-3 p-2">
                                                <Avatar className="h-12 w-12 rounded-lg">
                                                    <AvatarImage
                                                        src={`/storage/${user.picture}`}
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback className="rounded-lg text-sm font-medium">
                                                        {getUserInitials(
                                                            user.name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Link
                                                href="/dashboard/profile"
                                                className="flex items-center gap-2"
                                            >
                                                <SquareUser className="h-4 w-4 hover:text-primary" />
                                                <span>Profile Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer bg-accent hover:text-primary"
                                        >
                                            <LogOut className="h-4 w-4 hover:text-primary" />
                                            <span>Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-hidden">
                        <div className="h-full p-6">{children}</div>
                    </main>
                </div>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    );
}
