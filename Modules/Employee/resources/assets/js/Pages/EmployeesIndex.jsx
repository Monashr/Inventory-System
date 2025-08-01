import React from "react";

import { usePage, router, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import AddEmployeeForm from "./EmployeesAdd";

import { UserRound, Plus, Filter, SearchIcon, ArrowUpDown, Mail } from "lucide-react";

import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

function EmployeesIndex() {
    const { employees, authUser, permissions, filters } = usePage().props;
    const [open, setOpen] = React.useState(false);
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
                            <UserRound className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Employees
                        </h1>
                        {permissions.includes("edit employees") && (
                            <div className="flex justify-center items-center gap-2">
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger
                                        className="cursor-pointer"
                                        asChild
                                    >
                                        <Button>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Invite New Employee
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Invite New Employee
                                            </DialogTitle>
                                        </DialogHeader>
                                        <AddEmployeeForm
                                            onClose={() => setOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                                <Link href="/dashboard/employees/create">
                                    <Button className="cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create New Employee
                                    </Button>
                                </Link>
                            </div>
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
                                    <TableHead className="text-left pl-6">
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
                                    <TableHead className="text-right">
                                        <Button
                                            variant={
                                                filters.sort_by === "position"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("position")
                                            }
                                        >
                                            Position
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button
                                            variant={
                                                filters.sort_by === "email"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("email")}
                                        >
                                            Email
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button
                                            variant={
                                                filters.sort_by === "bio"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("bio")}
                                        >
                                            Bio
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button
                                            variant={
                                                filters.sort_by === "phone"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => handleSort("phone")}
                                        >
                                            Phone
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        <Button
                                            variant={
                                                filters.sort_by === "address"
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleSort("address")
                                            }
                                        >
                                            Address
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
                                            Joined At
                                            <ArrowUpDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="border-b">
                                {employees?.data?.length > 0 ? (
                                    employees.data.map((employee) => (
                                        <TableRow
                                            key={employee.id}
                                            className="group relative hover:bg-muted/50 cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/dashboard/employees/permission/${employee.id}`
                                                )
                                            }
                                        >
                                            <TableCell className="pl-9 font-medium flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={`/storage/${employee.picture}`}
                                                    />
                                                    <AvatarFallback>
                                                        {employee.name}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>
                                                    {employee.name}
                                                    {authUser?.id ===
                                                        employee.id && " (you)"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {employee.positions[0]?.name ??
                                                    "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {employee.email ?? "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {employee.bio ?? "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {employee.phone ?? "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {employee.address ?? "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium pr-9">
                                                {formatDate(
                                                    employee.created_at
                                                )}
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
                    </Card>

                    <div className="flex justify-between items-center gap-2">
                        <div className="flex gap-2 justify-center items-center">
                            <Button variant="outline">
                                {employees.from}-{employees.to} of{" "}
                                {employees.total}
                            </Button>
                            <Select
                                defaultValue={String(employees.per_page)}
                                onValueChange={(value) => {
                                    router.get(
                                        "/dashboard/employees",
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
                                    <SelectValue placeholder="Per Page" />
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

                        <Pagination>
                            <PaginationContent>
                                {employees.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={employees.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    employees.prev_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                                {employees.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={employees.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    employees.next_page_url
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

EmployeesIndex.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesIndex;
