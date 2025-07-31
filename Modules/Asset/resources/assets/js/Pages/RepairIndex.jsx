import React from "react";

import { usePage, router, Link } from "@inertiajs/react";

import {
    Hammer,
    Filter,
    Plus,
    SearchIcon,
    ArrowUpDown,
} from "lucide-react";

import Dashboard from "@components/layout/Dashboard";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
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
import { Card } from "@components/ui/card";

function RepairIndex() {
    const { repairs, permissions, filters } = usePage().props;

    const [search, setSearch] = React.useState(filters.search || "");
    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/repairs",
            {
                search,
                per_page: repairs.per_page,
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
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    return (
        <div>
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Hammer className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Repairs
                        </h1>
                        <Link href="/dashboard/repairs/add">
                            <Button className=" cursor-pointer">
                                <Plus />
                                Add Repair
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
                                            "/dashboard/repairs",
                                            {
                                                per_page: repairs.per_page,
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
                                    <TableHead className="text-left pl-7">
                                        <Button
                                            variant={
                                                filters.sort_by === "asset_name"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("asset_name")
                                            }
                                        >
                                            Asset
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-left">
                                        <Button
                                            variant={
                                                filters.sort_by ===
                                                "repair_start_date"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("repair_start_date")
                                            }
                                        >
                                            Repair Start
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-left">
                                        <Button
                                            variant={
                                                filters.sort_by ===
                                                "repair_completion_date"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort(
                                                    "repair_completion_date"
                                                )
                                            }
                                        >
                                            Repair Completion
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-left">
                                        <Button
                                            variant={
                                                filters.sort_by ===
                                                "repair_cost"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("repair_cost")
                                            }
                                        >
                                            Repair Cost
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-left">
                                        <Button
                                            variant={
                                                filters.sort_by === "vendor"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("vendor")}
                                        >
                                            Vendor
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right pr-6">
                                        <Button
                                            variant={
                                                filters.sort_by === "status"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {repairs?.data?.length > 0 ? (
                                    repairs.data.map((repair) => (
                                        <TableRow
                                            key={repair.id}
                                            className="group relative hover:bg-muted/50 cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/dashboard/repairs/${repair.id}/details`
                                                )
                                            }
                                        >
                                            {console.log(repair)}
                                            <TableCell className="pl-10 flex items-center gap-4">
                                                <span>
                                                    {repair.asset?.serial_code}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {formatDateNoHour(
                                                    repair.repair_start_date
                                                ) ?? "-"}
                                            </TableCell>
                                            <TableCell>
                                                {formatDateNoHour(
                                                    repair.repair_completion_date
                                                ) === "-"
                                                    ? "Repair Not Completed"
                                                    : formatDateNoHour(
                                                          repair.repair_completion_date
                                                      )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                Rp{repair.repair_cost ?? "-"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {repair.vendor ?? "-"}
                                            </TableCell>

                                            <TableCell className="text-right font-medium pr-9">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                                                                ${
                                                                    repair.status ===
                                                                    "completed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : repair.status ===
                                                                          "cancelled"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : repair.status ===
                                                                          "progress"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-gray-100 text-gray-500"
                                                                }
                                                            `}
                                                >
                                                    {repair.status
                                                        ? repair.status
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          repair.status.slice(1)
                                                        : "-"}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
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
                                                        No Repairs Found.
                                                    </h1>
                                                    <p className="font-light">
                                                        Add repairs or try
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
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex justify-center items-center gap-2">
                            <Button variant="outline">
                                {repairs.from}-{repairs.to} of {repairs.total}
                            </Button>
                            <Select
                                defaultValue={String(repairs.per_page)}
                                onValueChange={(value) => {
                                    router.get(
                                        `/dashboard/repairs/`,
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
                    </div>

                    <Pagination className="justify-end items-center">
                        <PaginationContent>
                            {repairs.prev_page_url && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={repairs.prev_page_url}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit(repairs.prev_page_url);
                                        }}
                                    />
                                </PaginationItem>
                            )}

                            {repairs.next_page_url && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={repairs.next_page_url}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit(repairs.next_page_url);
                                        }}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

RepairIndex.layout = (page) => <Dashboard children={page} />;

export default RepairIndex;
