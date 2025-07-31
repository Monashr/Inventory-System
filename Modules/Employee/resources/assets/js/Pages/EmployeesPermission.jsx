import React from "react";

import { Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { UserCog, Pencil, ChevronLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@components/ui/button";
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
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@components/ui/table";

function EmployeesPermission({ employee, rolePermissions, permissions }) {
    return (
        <div>
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <UserCog className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Permissions for {employee.name}
                        </h1>

                        <div className="flex gap-2 justify-center items-center">
                            {permissions.includes("edit employees") && (
                                <Link
                                    href={`/dashboard/employees/permissions/${employee.id}`}
                                >
                                    <Button
                                        variant="outline"
                                        data-modal-trigger="add-employee"
                                        className="cursor-pointer"
                                    >
                                        <Pencil />
                                        Edit User Permissions
                                    </Button>
                                </Link>
                            )}
                            <Link href="/dashboard/employees">
                                <Button
                                    data-modal-trigger="inbox"
                                    className="cursor-pointer"
                                >
                                    <ChevronLeft />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-200 hover:bg-slate-200">
                                    <TableHead className="text-left px-6">
                                        Permission
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rolePermissions.data.length > 0 ? (
                                    rolePermissions.data.map(
                                        (permission, idx) => (
                                            <TableRow
                                                key={idx}
                                                className="group relative hover:bg-muted/50"
                                            >
                                                <TableCell className="text-left font-medium px-6">
                                                    {permission.name}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-6"
                                        >
                                            No permissions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            {rolePermissions.from}-{rolePermissions.to} of{" "}
                            {rolePermissions.total}
                        </Button>
                        <Select
                            defaultValue={String(rolePermissions.per_page)}
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
                                {rolePermissions.prev_page_url && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={rolePermissions.prev_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    rolePermissions.prev_page_url
                                                );
                                            }}
                                        />
                                    </PaginationItem>
                                )}

                                {rolePermissions.next_page_url && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={rolePermissions.next_page_url}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.visit(
                                                    rolePermissions.next_page_url
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

EmployeesPermission.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesPermission;
