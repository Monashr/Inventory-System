import React, { useEffect } from "react";

import { usePage, router, Link, Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";

import {
    Package,
    Plus,
    SquarePen,
    Filter,
    SearchIcon,
    ArrowUpDown,
    Trash,
} from "lucide-react";

import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { toast } from "sonner";
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
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

function AssetTypesIndex() {
    const { assetTypes, permissions, filters, flash } = usePage().props;
    
    const [search, setSearch] = React.useState(filters.search || "");
    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/assettypes",
            {
                search,
                per_page: assetTypes.per_page,
                sort_by: column,
                sort_direction: direction,
            },
            { preserveScroll: true }
        );
    };

    const formatDateNoHour = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "-";
        }
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <div>
            <Head title="New Page Title" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Asset Types
                        </h1>

                        <Link href={"/dashboard/assettypes/add"}>
                            <Button className="cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Asset Type
                            </Button>
                        </Link>
                    </div>
                    <Card>
                        <div className="flex justify-between px-6">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                            >
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
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
                                            "/dashboard/assettypes",
                                            {
                                                per_page: assetTypes.per_page,
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
                                <TableRow className="bg-slate-200 hover:bg-slate-200">
                                    <TableHead className="pl-7">
                                        <Button
                                            variant={
                                                filters.sort_by === "name"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("name")}
                                        >
                                            Name
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="pr-6">
                                        <Button
                                            variant={
                                                filters.sort_by === "model"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("model")}
                                        >
                                            Model
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="w-full text-right pr-6">
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
                                {assetTypes?.data?.length > 0 ? (
                                    assetTypes?.data?.map((assetType) => (
                                        <TableRow
                                            key={assetType.id}
                                            className="group relative hover:bg-muted/50 cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/dashboard/assettypes/${assetType.id}/details`
                                                )
                                            }
                                        >
                                            <TableCell className="text-left font-medium pl-10">
                                                {assetType.name}
                                            </TableCell>
                                            <TableCell className="text-left font-medium">
                                                {assetType.model}
                                            </TableCell>
                                            <TableCell className="text-right font-medium pr-10">
                                                {formatDateNoHour(
                                                    assetType.created_at
                                                )}
                                                <div className="absolute bg-[#F2F2F3] right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6">
                                                    {permissions.includes(
                                                        "manage assets"
                                                    ) ? (
                                                        <Link
                                                            href={`/dashboard/assettypes/${assetType.id}/edit`}
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
                                                                url={`/dashboard/assettypes/${assetType.id}/delete`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Trash />
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
                                                        No Asset Types Found.
                                                    </h1>
                                                    <p className="font-light">
                                                        Add asset type or try
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
                        <div className="flex items-center justify-center gap-2">
                            <Button variant="outline">
                                {assetTypes.from}-{assetTypes.to} of{" "}
                                {assetTypes.total}
                            </Button>
                            <Select
                                defaultValue={String(assetTypes.per_page)}
                                onValueChange={(value) => {
                                    router.get(
                                        "/dashboard/assettypes",
                                        {
                                            per_page: value,
                                            search,
                                            sort_by: sortBy,
                                            sort_direction: sortDirection,
                                        },
                                        { preserveScroll: true }
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
                                {assetTypes.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={assetTypes.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    assetTypes.prev_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {assetTypes.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={assetTypes.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    assetTypes.next_page_url
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
        </div>
    );
}

AssetTypesIndex.layout = (page) => <Dashboard children={page} />;

export default AssetTypesIndex;
