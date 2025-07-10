import React, { useEffect } from "react";

import { Button } from "@components/ui/button";

import { usePage, Link, router } from "@inertiajs/react";

import {
    Package2Icon,
    HomeIcon,
    PackageIcon,
    UsersIcon,
    SquareUser,
    LogOut,
} from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@components/ui/popover";

import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import { MenuIcon } from "lucide-react";

const iconMap = {
    PackageIcon: PackageIcon,
    HomeIcon: HomeIcon,
    UsersIcon: UsersIcon,
};

export default function Dashboard({ children }) {
    const { moduleMenus } = usePage().props;

    const { url, component } = usePage();
    const currentPath = url;
    const isHomeActive = currentPath === "/dashboard";

    useEffect(() => {
        console.log("Dashboard layout mounted");
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-200">
            <div className="max-w-[1920px] max-h-[1080px] w-full h-full overflow-auto bg-white shadow-xl">
                <div className="grid h-screen min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
                    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                        <div className="flex h-full max-h-screen flex-col gap-2">
                            <div className="flex justify-center h-[60px] items-center border-b px-6">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 font-semibold"
                                >
                                    <Package2Icon className="h-6 w-6" />
                                    <span className="">CBN</span>
                                </a>
                            </div>
                            <div className="flex-1 overflow-auto py-2">
                                <nav className="grid items-start px-4 text-sm font-medium">
                                    <a
                                        href="/dashboard"
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                            isHomeActive
                                                ? "bg-gray-100 text-gray-900 dark:text-white"
                                                : "text-gray-500 dark:text-gray-50"
                                        }`}
                                    >
                                        <HomeIcon className="h-4 w-4" />
                                        Home
                                    </a>

                                    {moduleMenus.map((menu, idx) => {
                                        const Icon =
                                            iconMap[menu.icon] || HomeIcon;

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
                                                {menu.title}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col h-full overflow-hidden">
                        <header className="flex justify-between lg:justify-end h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden"
                                    >
                                        <MenuIcon className="h-5 w-5" />
                                        <span className="sr-only">
                                            Open sidebar
                                        </span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-0">
                                    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
                                        <div className="flex justify-center h-[60px] items-center border-b px-6">
                                            <a
                                                href="#"
                                                className="flex items-center gap-2 font-semibold"
                                            >
                                                <Package2Icon className="h-6 w-6" />
                                                <span className="">CBN</span>
                                            </a>
                                        </div>
                                        <div className="flex-1 overflow-auto py-2">
                                            <nav className="grid items-start px-4 text-sm font-medium">
                                                <Link
                                                    href="/dashboard"
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                                        isHomeActive
                                                            ? "bg-gray-100 text-gray-900 dark:text-white"
                                                            : "text-gray-500 dark:text-gray-50"
                                                    }`}
                                                >
                                                    <HomeIcon className="h-4 w-4" />
                                                    Home
                                                </Link>

                                                {moduleMenus.map(
                                                    (menu, idx) => {
                                                        const Icon =
                                                            iconMap[
                                                                menu.icon
                                                            ] || HomeIcon;
                                                        const isActive =
                                                            currentPath ===
                                                            menu.route;
                                                        return (
                                                            <Link
                                                                key={idx}
                                                                href={
                                                                    menu.route
                                                                }
                                                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                                                    isActive
                                                                        ? "bg-gray-100 text-gray-900 dark:text-white"
                                                                        : "text-gray-500 dark:text-gray-50"
                                                                }`}
                                                            >
                                                                <Icon className="h-4 w-4" />
                                                                {menu.title}
                                                            </Link>
                                                        );
                                                    }
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div>
                                        <Button
                                            variant="ghost"
                                            className="cursor-pointer"
                                        >
                                            U
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="end"
                                    className="w-40 p-2"
                                >
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/profile">
                                                <SquareUser />
                                                Profile
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.post("/logout")
                                            }
                                        >
                                            <LogOut />
                                            Logout
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </header>

                        <main className="flex-1 overflow-auto p-4 md:p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}
