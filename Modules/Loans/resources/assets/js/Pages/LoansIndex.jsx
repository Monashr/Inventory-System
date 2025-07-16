import React from "react";
import { Head, usePage, router } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import { PackageOpen } from "lucide-react";

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
                                                {loans.from}-{loans.to}{" "}
                                                of {loans.total}
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

                                            {/* {permissions.includes(
                                                "edit loans"
                                            ) && (
                                                <Dialog
                                                    open={open}
                                                    onOpenChange={setOpen}
                                                >
                                                    <DialogTrigger
                                                        className="cursor-pointer"
                                                        asChild
                                                    >
                                                        <Button>
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Employee
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Add New Employee
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <AddEmployeeForm
                                                            onClose={() =>
                                                                setOpen(false)
                                                            }
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            )} */}
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200">
                                <TableHead className="text-left pl-6">
                                    Name
                                </TableHead>
                                <TableHead className="text-left">
                                    Name
                                </TableHead>
                                <TableHead className="text-right">
                                    Email
                                </TableHead>
                                <TableHead className="text-right pr-6">
                                    Joined At
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans?.data?.length > 0 ? (
                                loans.data.map((loans) => (
                                    <TableRow
                                        key={loans.id}
                                        className="group relative hover:bg-muted/50 cursor-pointer"
                                        onClick={() =>
                                            router.visit(
                                                `/dashboard/loans/permission/${item.id}`
                                            )
                                        }
                                    >
                                        <TableCell>
                                            <img
                                                alt={loans.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover pl-4"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {loans.email}
                                        </TableCell>
                                        <TableCell className="text-right font-medium pr-6">
                                            {loans.created_at}
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
