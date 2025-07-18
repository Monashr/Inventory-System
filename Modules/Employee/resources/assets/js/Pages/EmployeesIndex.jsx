import React from "react";
import { usePage, router } from "@inertiajs/react";
import { UserRound, Plus } from "lucide-react";

import Dashboard from "@components/layout/Dashboard";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
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

import AddEmployeeForm from "./EmployeesAdd";

function EmployeesIndex() {
    const { employees, authUser, permissions } = usePage().props;
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={7}>
                                    <div className="flex items-center justify-between px-4 py-6">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <UserRound className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                            Employees
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {employees.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    employees.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
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
                                                                href={
                                                                    employees.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
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
                                            <Button variant="outline">
                                                {employees.from}-{employees.to}{" "}
                                                of {employees.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    employees.per_page
                                                )}
                                                onValueChange={(value) => {
                                                    router.get(
                                                        "/dashboard/employees",
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
                                                "edit employees"
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
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200">
                                <TableHead className="text-left pl-6">
                                    Name
                                </TableHead>
                                <TableHead className="text-right">
                                    Position
                                </TableHead>
                                <TableHead className="text-right">
                                    Email
                                </TableHead>
                                <TableHead className="text-right">
                                    Bio
                                </TableHead>
                                <TableHead className="text-right">
                                    Phone
                                </TableHead>
                                <TableHead className="text-right">
                                    Address
                                </TableHead>
                                <TableHead className="text-right pr-6">
                                    Joined At
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
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
                                        <TableCell className="pl-6 font-medium flex items-center gap-2">
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
                                                {authUser?.id === employee.id &&
                                                    " (you)"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {employee.positions[0]?.name ?? "-"}
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
                                        <TableCell className="text-right font-medium pr-6">
                                            {new Date(
                                                employee.created_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
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

EmployeesIndex.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesIndex;
