import React, { useEffect } from "react";

import { usePage, router, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import {
    PackageOpen,
    Plus,
    Filter,
    SearchIcon,
    ArrowUpDown,
} from "lucide-react";

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
import { toast } from "sonner";

function LoansIndex() {
    const { loans, permissions, filters, flash } = usePage().props;
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
            console.error("Error formatting date:", error);
            return "-";
        }
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
        <div>
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Loans
                        </h1>
                        {permissions.includes("edit loans") && (
                            <Link href="/dashboard/loans/add">
                                <Button className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Loans
                                </Button>
                            </Link>
                        )}
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
                                            "/dashboard/loans",
                                            {
                                                per_page: assets.per_page,
                                                search,
                                            },
                                            { preserveScroll: true }
                                        )
                                    }
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-200">
                                    <TableHead className="text-left pl-6">
                                        <Button
                                            variant={
                                                filters.sort_by === "loaner"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("loaner")}
                                        >
                                            Loaner
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-left pl-6">
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
                                    <TableHead className="text-left">
                                        <Button
                                            variant={
                                                filters.sort_by ===
                                                "description"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("description")
                                            }
                                        >
                                            Description
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
                                {loans?.data?.length > 0 ? (
                                    loans.data.map((loan) => (
                                        <TableRow
                                            key={loan.id}
                                            className="group relative hover:bg-muted/50 cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/dashboard/loans/${loan.id}`
                                                )
                                            }
                                        >
                                            <TableCell className="pl-9">
                                                {loan.user.name}
                                            </TableCell>
                                            <TableCell className="text-left font-medium">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        loan.status ===
                                                        "accepted"
                                                            ? "bg-green-100 text-green-800"
                                                            : loan.status ===
                                                              "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : loan.status ===
                                                              "cancelled"
                                                            ? "bg-slate-100 text-slate-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {loan.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        loan.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-left font-medium">
                                                {loan.description}
                                            </TableCell>
                                            <TableCell className="text-right font-medium pr-9">
                                                {formatDateNoHour(
                                                    loan.created_at
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
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
                                                        No Loans Found.
                                                    </h1>
                                                    <p className="font-light">
                                                        Add loans or try
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
                    <div className="flex gap-2">
                        <Button variant="outline">
                            {loans.from}-{loans.to} of {loans.total}
                        </Button>
                        <Select
                            defaultValue={String(loans.per_page)}
                            onValueChange={(value) => {
                                router.get(
                                    "/dashboard/loans",
                                    { per_page: value },
                                    { preserveScroll: true }
                                );
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Per Page" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <Pagination className="justify-end items-center">
                            <PaginationContent>
                                {loans.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={loans.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    loans.prev_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                                {loans.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={loans.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    loans.next_page_url
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

LoansIndex.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansIndex;
