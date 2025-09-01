import React from "react";

import { Head, Link, router } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { UserCog, Pencil, ChevronLeft, Ban, Trash2 } from "lucide-react";

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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
} from "@components/ui/dialog";

function EmployeesPermission({ employee, rolePermissions, permissions }) {
    return (
        <>
            <Head title="Employee Permissions" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <UserCog className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Employee Permission
                            </h1>

                            <div className="flex gap-2 justify-center items-center">
                                {permissions.includes(
                                    "permission employees"
                                ) && (
                                    <>
                                        {rolePermissions.data.length > 0 && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="cursor-pointer"
                                                    >
                                                        <Ban />
                                                        Revoke All Permissions
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Revoke All
                                                            Permission
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure want to
                                                            revoke all the
                                                            permissions on this
                                                            user?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex justify-end items-center">
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/dashboard/employees/revoke/${employee.id}`
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Ban />
                                                            Revoke All
                                                            Permission
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                        {permissions.includes(
                                            "delete employees"
                                        ) && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="cursor-pointer"
                                                    >
                                                        <Trash2 />
                                                        Delete User
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Delete User
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure want to
                                                            delete this user?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex justify-end items-center">
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/dashboard/employees/delete/${employee.id}`
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Trash2 />
                                                            Delete User
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        <Link
                                            href={`/dashboard/employees/permissions/${employee.id}`}
                                        >
                                            <Button
                                                variant="outline"
                                                className="cursor-pointer"
                                            >
                                                <Pencil />
                                                Edit User Permissions
                                            </Button>
                                        </Link>
                                    </>
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
                    </Card>
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-200 hover:bg-slate-200 dark:bg-background dark:hover:bg-background">
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
                </div>
            </div>
        </>
    );
}

EmployeesPermission.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesPermission;
