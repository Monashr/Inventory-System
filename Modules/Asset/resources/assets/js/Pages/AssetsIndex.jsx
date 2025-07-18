import React from "react";
import { usePage, router, Link } from "@inertiajs/react";

import {
    Package,
    Plus,
    SquarePen,
    Boxes,
    ChevronRight,
    Pencil,
} from "lucide-react";

import Dashboard from "@components/layout/Dashboard";
import { Button } from "@components/ui/button";
import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

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
import { Card } from "@components/ui/card";

function AssetsIndex() {
    const { assetType, assets, permissions, totalAvailableAssets, totalLoanedAssets, totalDefectAssets } =
        usePage().props;

    return (
        <div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 border shadow-sm rounded-lg px-8 py-6">
                    <Card>
                        <div className="flex justify-between flex-wrap gap-4 w-full px-6 py-4">
                            <h1 className="font-semibold text-2xl flex items-center">
                                <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />

                                {assetType.name}
                            </h1>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline">
                                    <Label htmlFor="stock">
                                        Total Assets
                                    </Label>
                                    {totalAvailableAssets + totalDefectAssets + totalLoanedAssets}
                                </Button>
                                <Button variant="outline" className="border-emerald-300 hover:bg-emerald-100">
                                    <Label htmlFor="stock">
                                        Available Assets
                                    </Label>
                                    {totalAvailableAssets}
                                </Button>
                                <Button variant="outline" className="border-orange-300 hover:bg-orange-100">
                                    <Label htmlFor="stock">
                                        Loaned Assets
                                    </Label>
                                    {totalLoanedAssets}
                                </Button>
                                <Button variant="outline" className="border-red-300 hover:bg-red-100">
                                    <Label htmlFor="stock">
                                        Defect Assets
                                    </Label>
                                    {totalDefectAssets}
                                </Button>
                                {permissions.includes("edit assets") ? (
                                    <Link
                                        href={`/dashboard/assets/edit/${assetType.id}`}
                                    >
                                        <Button
                                            data-modal-trigger="add-product"
                                            className=" cursor-pointer"
                                        >
                                            <Pencil />
                                            Edit Asset Type
                                        </Button>
                                    </Link>
                                ) : null}
                                <Link href="/dashboard/assets">
                                    <Button
                                        data-modal-trigger="add-product"
                                        className=" cursor-pointer"
                                    >
                                        Back
                                        <ChevronRight />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={5}>
                                    <div className="flex items-center justify-between px-6 py-6">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <Boxes className="mr-2" />
                                            Assets
                                        </h1>
                                        <div className="flex gap-2">
                                            <Pagination className="justify-end items-center">
                                                <PaginationContent>
                                                    {assets.prev_page_url && (
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href={
                                                                    assets.prev_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        assets.prev_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}

                                                    {assets.next_page_url && (
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href={
                                                                    assets.next_page_url
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.visit(
                                                                        assets.next_page_url
                                                                    );
                                                                }}
                                                            />
                                                        </PaginationItem>
                                                    )}
                                                </PaginationContent>
                                            </Pagination>
                                            <Button variant="outline">
                                                {assets.from}-{assets.to} of{" "}
                                                {assets.total}
                                            </Button>
                                            <Select
                                                defaultValue={String(
                                                    assets.per_page
                                                )}
                                                onValueChange={(value) => {
                                                    router.get(
                                                        `/dashboard/items/${assetType.id}/unit`,
                                                        {
                                                            per_page: value,
                                                        },
                                                        {
                                                            preserveScroll: true,
                                                        }
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
                                                <Link href="/dashboard/assets/add">
                                                    <Button
                                                        data-modal-trigger="add-product"
                                                        className=" cursor-pointer"
                                                    >
                                                        <Plus />
                                                        Add Asset
                                                    </Button>
                                                </Link>
                                            ) : null}
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="bg-slate-200 hover:bg-slate-200">
                                <TableHead className="text-left pl-8">
                                    Unit Id
                                </TableHead>
                                <TableHead className="text-left">
                                    Brand
                                </TableHead>
                                <TableHead className="text-left">
                                    Condition
                                </TableHead>
                                <TableHead className="text-left">
                                    Avaibility
                                </TableHead>
                                <TableHead className="text-right pr-8">
                                    Created At
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assets?.data?.length > 0 ? (
                                assets.data.map((asset) => (
                                    <TableRow
                                        key={asset.id}
                                        className="group relative hover:bg-muted/50 cursor-pointer"
                                        onClick={() =>
                                            router.visit(
                                                `/dashboard/assets/${asset.id}/details`
                                            )
                                        }
                                    >
                                        <TableCell className="pl-9 flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={asset.name} />
                                                <AvatarFallback>
                                                    {assetType.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{asset.serial_code}</span>
                                        </TableCell>
                                        <TableCell>
                                            {asset.brand ?? "No Brand"}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    asset.condition === "good"
                                                        ? "bg-green-100 text-green-800"
                                                        : asset.condition ===
                                                          "used"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {asset.condition
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    asset.condition.slice(1)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    asset.avaibility ===
                                                    "available"
                                                        ? "bg-green-100 text-green-800"
                                                        : asset.avaibility ===
                                                          "loaned"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {asset.avaibility
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    asset.avaibility.slice(1)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right font-medium pr-8">
                                            {new Date(
                                                asset.created_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            <div className="absolute bg-white right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6">
                                                {permissions.includes(
                                                    "edit assets"
                                                ) ? (
                                                    <Link
                                                        href={`/dashboard/assets/edit/assets/${asset.id}`}
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
                                                            itemId={asset.id}
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
                                        colSpan={5}
                                        className="text-center py-6"
                                    >
                                        No Assets found.
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

AssetsIndex.layout = (page) => <Dashboard children={page} />;

export default AssetsIndex;
