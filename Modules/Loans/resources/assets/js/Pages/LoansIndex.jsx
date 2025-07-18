import React from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import { PackageOpen, Plus } from "lucide-react";

import { Button } from "@components/ui/button";

import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";

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

import { Card, CardContent } from "@components/ui/card";

function LoansIndex() {
    const { loans, permissions } = usePage().props;

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
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={4}>
                                    <div className="flex items-center justify-between px-4 py-6">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                            Loans
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {loans.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    loans.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
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
                                                                href={
                                                                    loans.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
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
                                            <Button variant="outline">
                                                {loans.from}-{loans.to} of{" "}
                                                {loans.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    loans.per_page
                                                )}
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
                                                    <SelectItem value="10">
                                                        10
                                                    </SelectItem>
                                                    <SelectItem value="25">
                                                        25
                                                    </SelectItem>
                                                    <SelectItem value="50">
                                                        50
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {permissions.includes(
                                                "edit loans"
                                            ) && (
                                                <Link href="/dashboard/loans/add">
                                                    <Button className="cursor-pointer">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Loans
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200">
                                <TableHead className="text-left pl-6">
                                    Loaner
                                </TableHead>
                                <TableHead className="text-left pl-6">
                                    Status
                                </TableHead>
                                <TableHead className="text-left">
                                    description
                                </TableHead>
                                <TableHead className="text-right pr-6">
                                    Created At
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
                                        <TableCell className="pl-6">
                                            {loan.user.name}
                                        </TableCell>
                                        <TableCell className="text-left font-medium">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    loan.status === "accepted"
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
                                        <TableCell className="text-right font-medium pr-6">
                                            {formatDateNoHour(loan.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-6"
                                    >
                                        No items found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

LoansIndex.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansIndex;
