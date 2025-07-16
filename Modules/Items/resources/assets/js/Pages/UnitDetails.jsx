import React from "react";

import Dashboard from "@components/layout/Dashboard";

import { usePage, router, Link } from "@inertiajs/react";

import { Package, Plus, SquarePen } from "lucide-react";

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

import { Label } from "@components/ui/label";

function UnitsIndex() {
    const { item, units } = usePage().props;

    return (
        <div>
            <div className="space-y-6">
                <div className="border shadow-sm rounded-lg">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Item Name</Label>
                            {item.name}
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                            {item.stock}
                            </div>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={4}>
                                    <div className="flex items-center justify-between px-4 py-6">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <Package className="mr-2" />
                                            Units
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {units.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    units.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        units.prev_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}

                                                    {units.next_page_url && (
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href={
                                                                    units.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        units.next_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}
                                                </PaginationContent>
                                            </Pagination>
                                            <Button variant="outline">
                                                {units.from}-{units.to} of{" "}
                                                {units.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    units.per_page
                                                )}
                                                onValueChange={(value) => {
                                                    router.get(
                                                        "/dashboard/items/units",
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

                                            <Link href="/dashboard/items/add">
                                                <Button
                                                    data-modal-trigger="add-product"
                                                    className=" cursor-pointer"
                                                >
                                                    <Plus />
                                                    Add Item
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200 hover:bg-slate-200">
                                <TableHead className="text-left pl-8">
                                    Image
                                </TableHead>
                                <TableHead className="text-left">
                                    Unit Id
                                </TableHead>
                                <TableHead className="text-left">
                                    Avaibility
                                </TableHead>
                                <TableHead className="text-right pr-8">
                                    Total Units
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {units?.data?.length > 0 ? (
                                units.data.map((unit) => (
                                    <TableRow
                                        key={unit.id}
                                        className="group relative hover:bg-muted/50 cursor-pointer"
                                        onClick={() =>
                                            router.visit(
                                                `/dashboard/items/units/${unit.id}/details`
                                            )
                                        }
                                    >
                                        <TableCell>
                                            <img
                                                alt={unit.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover pl-6"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <span>{unit.unit_code}</span>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    unit.available
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {unit.available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right font-medium pr-8">
                                            {unit.stock}
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6">
                                                <Link
                                                    href={`/dashboard/items/edit/${unit.id}`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="cursor-pointer"
                                                    >
                                                        <SquarePen />
                                                    </Button>
                                                </Link>
                                                <div
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <DeleteAlertDialog
                                                        itemId={unit.id}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-6"
                                    >
                                        No unit found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

UnitsIndex.layout = (page) => <Dashboard children={page} />;

export default UnitsIndex;
