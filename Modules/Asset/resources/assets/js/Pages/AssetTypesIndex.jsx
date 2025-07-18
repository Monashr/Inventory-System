import React from "react";
import { usePage, router, Link } from "@inertiajs/react";

import { Package, Plus, SquarePen } from "lucide-react";

import { Button } from "@components/ui/button";
import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";
import { Card, CardContent } from "@components/ui/card";
import Dashboard from "@components/layout/Dashboard";
import ItemsAddForm from "./AssetTypesAdd";

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

function AssetTypesIndex() {
    const { assetTypes, permissions } = usePage().props;
    const [open, setOpen] = React.useState(false);

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
                                            <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                            Assets
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {assetTypes.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    assetTypes.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        assetTypes.prev_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}

                                                    {assetTypes.next_page_url && (
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href={
                                                                    assetTypes.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        assetTypes.next_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}
                                                </PaginationContent>
                                            </Pagination>
                                            <Button variant="outline">
                                                {assetTypes.from}-{assetTypes.to} of{" "}
                                                {assetTypes.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    assetTypes.per_page
                                                )}
                                                onValueChange={(value) => {
                                                    router.get(
                                                        "/dashboard/assets",
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
                                            {permissions.includes(
                                                "edit assets"
                                            ) ? (
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
                                                            Add Asset
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Add New Asset
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <ItemsAddForm
                                                            onClose={() =>
                                                                setOpen(false)
                                                            }
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            ) : null}
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200 hover:bg-slate-200">
                                <TableHead className="text-left px-9">
                                    Name
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assetTypes?.data?.length > 0 ? (
                                assetTypes.data.map((assetType) => (
                                    <TableRow
                                        key={assetType.id}
                                        className="group relative hover:bg-muted/50 cursor-pointer"
                                        onClick={() =>
                                            router.visit(
                                                `/dashboard/assets/${assetType.id}`
                                            )
                                        }
                                    >
                                        <TableCell className="text-lft font-medium px-9">
                                            {assetType.name}
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6">
                                                {permissions.includes(
                                                    "edit assets"
                                                ) ? (
                                                    <Link
                                                        href={`/dashboard/assets/edit/${assetType.id}`}
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
                                                ) : null}
                                                {permissions.includes(
                                                    "delete assets"
                                                ) ? (
                                                    <div
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <DeleteAlertDialog
                                                            itemId={assetType.id}
                                                        />
                                                    </div>
                                                ) : null}
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
                                        No assets found.
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

AssetTypesIndex.layout = (page) => <Dashboard children={page} />;

export default AssetTypesIndex;
