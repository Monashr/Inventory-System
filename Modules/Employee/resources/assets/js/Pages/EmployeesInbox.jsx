import React from "react";

import { router, Link, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import {
    Mail,
    ChevronLeft,
    SearchIcon,
    Filter,
    ArrowUpDown,
} from "lucide-react";

import { Input } from "@components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

function EmployeesInbox() {
    const { inboxes, filters } = usePage().props;
    const [search, setSearch] = React.useState(filters.search || "");
    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/employees",
            {
                search,
                per_page: employees.per_page,
                sort_by: column,
                sort_direction: direction,
            },
            { preserveScroll: true }
        );
    };

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

    return (
        <div>
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Mail className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Inboxes
                        </h1>

                        <Link href="/dashboard">
                            <Button
                                data-modal-trigger="inbox"
                                className="cursor-pointer"
                            >
                                <ChevronLeft />
                                Back
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
                                            "/dashboard/employees",
                                            {
                                                per_page: employees.per_page,
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
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-200">
                                    <TableHead className="pl-6">
                                        <Button
                                            variant={
                                                filters.sort_by ===
                                                "sender_name"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("sender_name")
                                            }
                                        >
                                            Sender
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant={
                                                filters.sort_by === "tenant"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("tenant")}
                                        >
                                            Tenant
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
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
                                            Sent At
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="pr-8 text-right">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inboxes.data.length > 0 ? (
                                    inboxes.data.map((inbox) => (
                                        <TableRow key={inbox.id}>
                                            <TableCell className="pl-9 flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={`/storage/${inbox.sender.picture}`}
                                                    />
                                                    <AvatarFallback>
                                                        {inbox.sender.name}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {inbox.sender.name}
                                            </TableCell>
                                            <TableCell>
                                                {inbox.tenant.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatDate(inbox.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2 pr-8">
                                                {inbox.status === "pending" ? (
                                                    <div className="flex justify-end items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/dashboard/inbox/accept/${inbox.id}`
                                                                )
                                                            }
                                                            className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                router.delete(
                                                                    `/dashboard/inbox/decline/${inbox.id}`
                                                                )
                                                            }
                                                            className="hover:bg-red-100 hover:text-red-500 cursor-pointer"
                                                        >
                                                            Decline
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                            inbox.status ===
                                                            "accepted"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {inbox.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            inbox.status.slice(
                                                                1
                                                            )}
                                                    </span>
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
                                                        No Messages Found.
                                                    </h1>
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
                            {inboxes.from}-{inboxes.to} of {inboxes.total}
                        </Button>
                        <Select
                            defaultValue={String(inboxes.per_page)}
                            onValueChange={(value) => {
                                router.get(
                                    "/dashboard/employees",
                                    { per_page: value },
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
                        <Pagination className="justify-end items-center">
                            <PaginationContent>
                                {inboxes.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={inboxes.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    inboxes.prev_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {inboxes.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={inboxes.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    inboxes.next_page_url
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

EmployeesInbox.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesInbox;
