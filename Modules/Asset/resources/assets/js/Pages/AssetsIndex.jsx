import React, { useRef, useEffect } from "react";

import { Head, usePage, router, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";

import {
    Package,
    Plus,
    SquarePen,
    SearchIcon,
    Filter,
    ArrowUpDown,
    FileUp,
    FileDown,
    Trash2Icon,
} from "lucide-react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@components/ui/pagination";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@components/ui/label";
import { Card } from "@components/ui/card";
import { toast } from "sonner";

function AssetsIndex() {
    const { assets, permissions, filters, flash } = usePage().props;

    const [search, setSearch] = React.useState(filters.search || "");
    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";
    const fileInputRef = useRef(null);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            router.post("/dashboard/assets/import", formData, {
                forceFormData: true,
                onSuccess: () => {},
                onError: () => {},
            });
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "-";
        }
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/assets",
            {
                search,
                per_page: assets.per_page,
                sort_by: column,
                sort_direction: direction,
            },
            { preserveScroll: true }
        );
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <Head title="Assets" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Assets
                        </h1>
                        <div className="flex justify-center items-center gap-2">
                            {permissions.includes("manage assets") ? (
                                <>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="cursor-pointer"
                                            >
                                                <FileDown className="mr-2 w-4 h-4" />
                                                Import Assets
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-2 flex flex-col gap-2">
                                            <a
                                                href="/dashboard/assets/template"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full cursor-pointer justify-start"
                                                >
                                                    <FileDown className="mr-2 w-4 h-4" />
                                                    Download Template
                                                </Button>
                                            </a>

                                            <Button
                                                variant="outline"
                                                className="cursor-pointer w-full justify-start"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <FileDown className="mr-2 w-4 h-4" />
                                                Import File
                                            </Button>
                                            <input
                                                type="file"
                                                accept=".xlsx,.csv"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <a
                                        href="/dashboard/assets/export"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center border border-input rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
                                    >
                                        <FileUp className="mr-2 w-4 h-4" />
                                        Export Assets
                                    </a>

                                    <Link href="/dashboard/assets/add">
                                        <Button className="cursor-pointer">
                                            <Plus />
                                            Add Asset
                                        </Button>
                                    </Link>
                                </>
                            ) : null}
                        </div>
                    </div>
                    <Card>
                        <div className="flex justify-between px-6">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        <Filter className="w-4 h-4" />
                                        Filter
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h1 className="leading-none font-medium">
                                                Filter
                                            </h1>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="width">
                                                    Brand
                                                </Label>
                                                <Input
                                                    id="width"
                                                    defaultValue="100%"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="maxWidth">
                                                    Condition
                                                </Label>
                                                <Input
                                                    id="maxWidth"
                                                    defaultValue="300px"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="height">
                                                    availability
                                                </Label>
                                                <Input
                                                    id="height"
                                                    defaultValue="25px"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <div className="flex w-full max-w-sm items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() =>
                                        router.get(
                                            "/dashboard/assets",
                                            {
                                                per_page: assets.per_page,
                                                search,
                                                sort_by: sortBy,
                                                sort_direction: sortDirection,
                                            },
                                            { preserveScroll: true }
                                        )
                                    }
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Table className="border-b">
                            <TableHeader>
                                <TableRow className="bg-slate-200 hover:bg-slate-200 dark:bg-background dark:hover:bg-background">
                                    <TableHead className="pl-7">
                                        <Button
                                            variant={
                                                filters.sort_by ===
                                                "serial_code"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("serial_code")
                                            }
                                        >
                                            Serial Code
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-left">
                                        <Button
                                            variant={
                                                filters.sort_by === "brand"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("brand")}
                                        >
                                            Brand
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-center w-[10%]">
                                        <Button
                                            variant={
                                                filters.sort_by === "condition"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("condition")
                                            }
                                        >
                                            Condition
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-center w-[10%]">
                                        <Button
                                            variant={
                                                filters.sort_by === "avaibility"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("avaibility")
                                            }
                                        >
                                            Avaibility
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right pr-6">
                                        <Button
                                            variant={
                                                filters.sort_by === "created_at"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("created_at")
                                            }
                                        >
                                            Created At
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets?.data?.length > 0 ? (
                                    assets.data.map((asset) => (
                                        <TableRow
                                            key={asset.id}
                                            className="group relative hover:bg-muted cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/dashboard/assets/${asset.id}/details`
                                                )
                                            }
                                        >
                                            <TableCell className="pl-9 flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={asset.name}
                                                    />
                                                    <AvatarFallback>
                                                        {asset.serial_code.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{asset.serial_code}</span>
                                            </TableCell>
                                            <TableCell>
                                                {asset.brand ?? "No Brand"}
                                            </TableCell>
                                            <TableCell className="font-medium text-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        asset.condition ===
                                                        "good"
                                                            ? "bg-green-100 text-green-800"
                                                            : asset.condition ===
                                                              "used"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {asset.condition
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        asset.condition.slice(
                                                            1
                                                        )}
                                                </span>
                                            </TableCell>

                                            <TableCell className="font-medium text-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        asset.avaibility ===
                                                        "available"
                                                            ? "bg-green-100 text-green-800"
                                                            : asset.avaibility ===
                                                              "loaned"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {asset.avaibility
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        asset.avaibility.slice(
                                                            1
                                                        )}
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-right font-medium pr-8">
                                                {formatDate(asset.created_at)}
                                                <div className="absolute bg-[#f9f9f9] dark:bg-[#26282d] right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6 pl-2 rounded-4xl">
                                                    {permissions.includes(
                                                        "manage assets"
                                                    ) ? (
                                                        <Link
                                                            href={`/dashboard/assets/${asset.id}/edit`}
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="cursor-pointer"
                                                            >
                                                                <SquarePen />
                                                            </Button>
                                                        </Link>
                                                    ) : null}
                                                    {permissions.includes(
                                                        "manage assets"
                                                    ) ? (
                                                        <div
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <DeleteAlertDialog
                                                                url={`/dashboard/assets/${asset.id}/delete`}
                                                            >
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Trash2Icon className="w-4 h-4" />
                                                                </Button>
                                                            </DeleteAlertDialog>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-12 px-6"
                                        >
                                            <div className="flex flex-col gap-4">
                                                <img
                                                    src="/NoExist.svg"
                                                    alt="no exist"
                                                    className="max-w-60 m-auto"
                                                />
                                                <div>
                                                    <h1 className="font-bold">
                                                        No Assets Found.
                                                    </h1>
                                                    <p className="font-light">
                                                        Add assets or try
                                                        searching with different
                                                        keyword
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center justify-center gap-2 bg-card p-2 rounded-3xl shadow">
                            <Button variant="outline">
                                {assets.from}-{assets.to} of {assets.total}
                            </Button>

                            <Select
                                defaultValue={String(assets.per_page)}
                                onValueChange={(value) => {
                                    router.get(
                                        `/dashboard/assets/`,
                                        {
                                            per_page: value,
                                            search,
                                            sort_by: sortBy,
                                            sort_direction: sortDirection,
                                        },
                                        {
                                            preserveScroll: true,
                                        }
                                    );
                                }}
                            >
                                <SelectTrigger className="w-[180px] cursor-pointer">
                                    <SelectValue placeholder="Select a value" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="10"
                                        className="cursor-pointer"
                                    >
                                        10
                                    </SelectItem>
                                    <SelectItem
                                        value="25"
                                        className="cursor-pointer"
                                    >
                                        25
                                    </SelectItem>
                                    <SelectItem
                                        value="50"
                                        className="cursor-pointer"
                                    >
                                        50
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Pagination className="justify-end items-center">
                            <PaginationContent>
                                {assets.prev_page_url && (
                                    <PaginationItem className="bg-card shadow rounded-3xl">
                                        <PaginationPrevious
                                            href={assets.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    assets.prev_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {assets.next_page_url && (
                                    <PaginationItem className="bg-card shadow rounded-3xl">
                                        <PaginationNext
                                            href={assets.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    assets.next_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </>
    );
}

AssetsIndex.layout = (page) => <Dashboard children={page} />;

export default AssetsIndex;
