import React from "react";
import { router, Link, usePage } from "@inertiajs/react";
import { Package, SquarePen, Trash2, Plus } from "lucide-react";
import Dashboard from "@components/layout/Dashboard";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@components/ui/select";

function EmployeesInbox() {
    const { inboxes } = usePage().props;

    return (
        <div className="w-full">
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={4}>
                                    <div className="flex items-center justify-between px-4 py-6">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <Package className="mr-2" />
                                            inboxes
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {inboxes.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    inboxes.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
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
                                                                href={
                                                                    inboxes.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
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
                                            <Button variant="outline">
                                                {inboxes.from}-{inboxes.to}{" "}
                                                of {inboxes.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    inboxes.per_page
                                                )}
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

                                            <Link href="/dashboard">
                                                <Button
                                                    data-modal-trigger="inbox"
                                                    className="cursor-pointer"
                                                >
                                                    
                                                    Back
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200">
                                <TableHead>Sender</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead className="text-right">
                                    Sent At
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inboxes.data.length > 0 ? (
                                inboxes.data.map((inbox) => (
                                    <TableRow key={inbox.id}>
                                        <TableCell>
                                            {inbox.sender.name}
                                        </TableCell>
                                        <TableCell>
                                            {inbox.tenant.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {inbox.created_at}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    router.post(
                                                        `/dashboard/employee/inbox/accept/${inbox.id}`
                                                    )
                                                }
                                                className="bg-green-600 text-white hover:bg-green-700"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    router.delete(
                                                        `/dashboard/employee/inbox/decline/${inbox.id}`
                                                    )
                                                }
                                                className="hover:bg-red-100 hover:text-red-500"
                                            >
                                                Decline
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-6"
                                    >
                                        No inbox messages found.
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

EmployeesInbox.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesInbox;
