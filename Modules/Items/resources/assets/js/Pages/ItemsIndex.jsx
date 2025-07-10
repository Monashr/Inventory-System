import React from "react";

import Dashboard from "@components/layout/Dashboard";

import { usePage, router, Link } from "@inertiajs/react";

import { Package, Plus, Trash2, SquarePen } from "lucide-react";

import { Button } from "@components/ui/button";

import DeleteAlertDialog from "@components/custom/deletealertdialog";

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
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@components/ui/popover";

import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";

function handleDelete(id) {
    router.delete(`/dashboard/items/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
            console.log("Deleted");
        },
        onError: (err) => {
            console.error(err);
        },
    });
}

function ItemsIndex() {
    const { items } = usePage().props;

    return (
        <div>
            <DynamicBreadcrumbs />
            <div className="space-y-6">
                <div className="border shadow-sm rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={4}>
                                    <div className="flex items-center justify-between px-4 py-6">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <Package className="mr-2" />
                                            Items
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {items.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    items.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        items.prev_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}

                                                    {items.next_page_url && (
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href={
                                                                    items.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        items.next_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}
                                                </PaginationContent>
                                            </Pagination>
                                            <Button variant="outline">
                                                {items.from}-{items.to} of{" "}
                                                {items.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    items.per_page
                                                )}
                                                onValueChange={(value) => {
                                                    router.get(
                                                        "/dashboard/items",
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
                                    Name
                                </TableHead>
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                                <TableHead className="text-right pr-8">
                                    Stock
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items?.data?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="group relative hover:bg-muted/50"
                                >
                                    <TableCell>
                                        <img
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="rounded-md object-cover pl-6"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <span>{item.name}</span>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        ${item.price}
                                    </TableCell>
                                    <TableCell className="text-right font-medium pr-8">
                                        {item.stock}
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6">
                                            <Link
                                                href={`/dashboard/items/edit/${item.id}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                >
                                                    <SquarePen />
                                                </Button>
                                            </Link>
                                            <DeleteAlertDialog
                                                itemId={item.id}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

ItemsIndex.layout = (page) => <Dashboard children={page} />;

export default ItemsIndex;
