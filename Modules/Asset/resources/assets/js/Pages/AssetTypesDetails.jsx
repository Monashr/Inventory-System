import React from "react";

import { usePage, router, Link, Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";

import {
    Package,
    Boxes,
    ChevronLeft,
    Pen,
    Trash,
} from "lucide-react";

import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Card } from "@components/ui/card";
import useAssetIndex from "../Hooks/Assets/useAssetsIndex";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomTableSearch from "@components/custom/CustomTableSearch";
import CustomPagination from "@components/custom/CustomPagination";

function AssetsIndex() {
    const {
        assetType,
        assets,
        filters,
        permissions,
        totalAvailableAssets,
        totalLoanedAssets,
        totalDefectAssets,
    } = usePage().props;

    const [search, setSearch] = React.useState(filters.search || "");
    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            `/dashboard/assettypes/${assetType.id}/details`,
            {
                search,
                per_page: assets.per_page,
                sort_by: column,
                sort_direction: direction,
            },
            { preserveScroll: true }
        );
    };

    const assetIndexLogic = useAssetIndex();

    return (
        <>
            <Head title={assetType.name} />

            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <Package className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                {assetType.name}
                            </h1>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline">
                                    <Label htmlFor="stock">Total Assets</Label>
                                    {totalAvailableAssets +
                                        totalDefectAssets +
                                        totalLoanedAssets}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-emerald-300 hover:bg-emerald-100"
                                >
                                    <Label htmlFor="stock">
                                        Available Assets
                                    </Label>
                                    {totalAvailableAssets}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-orange-300 hover:bg-orange-100"
                                >
                                    <Label htmlFor="stock">Loaned Assets</Label>
                                    {totalLoanedAssets}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-red-300 hover:bg-red-100"
                                >
                                    <Label htmlFor="stock">Defect Assets</Label>
                                    {totalDefectAssets}
                                </Button>
                                <div className="flex gap-2 flex-wrap">
                                    {permissions.includes("manage assets") ? (
                                        <Link
                                            href={`/dashboard/assettypes/${assetType.id}/edit`}
                                        >
                                            <Button
                                                variant="outline"
                                                data-modal-trigger="add-product"
                                                className="cursor-pointer"
                                            >
                                                <Pen className="w-4 h-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                    ) : null}
                                    {permissions.includes("manage assets") ? (
                                        <DeleteAlertDialog
                                            url={`/dashboard/assettypes/${assetType.id}/delete`}
                                        >
                                            <Button
                                                variant="destructive"
                                                className="cursor-pointer"
                                            >
                                                <Trash />
                                                Delete
                                            </Button>
                                        </DeleteAlertDialog>
                                    ) : null}
                                    <Link href="/dashboard/assettypes">
                                        <Button
                                            data-modal-trigger="add-product"
                                            className=" cursor-pointer"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Back
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                                <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                    <Boxes className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                    Asset List
                                </h1>
                                <div className="grid grid-cols-1 gap-2 sm:flex">
                                    <CustomTableSearch
                                        search={assetIndexLogic.search}
                                        setSearch={assetIndexLogic.setSearch}
                                        onSearch={assetIndexLogic.onSearch}
                                        placeholder="Search Asset"
                                    />
                                </div>
                            </div>
                            <CustomDataTable
                                columns={assetIndexLogic.columns}
                                data={assetIndexLogic.assets.data}
                                onRowClick={assetIndexLogic.onRowClick}
                                onSort={assetIndexLogic.handleSort}
                                filters={assetIndexLogic.filters}
                                noItem="Assets"
                            />
                        </Card>
                        <CustomPagination
                            data={assetIndexLogic.assets}
                            onPaginationChange={
                                assetIndexLogic.onPaginationChange
                            }
                        />
                    </div>

                    {/* <Table className="border bg-card">
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={5}>
                                <div className="flex items-center justify-between px-6 py-6">
                                    <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                        <Boxes className="mr-2" />
                                        Assets
                                    </h1>

                                    <div className="flex gap-2">
                                        {permissions.includes("edit assets") ? (
                                            <Link href="/dashboard/assets/add">
                                                <Button
                                                    data-modal-trigger="add-product"
                                                    className=" cursor-pointer"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add Asset
                                                </Button>
                                            </Link>
                                        ) : null}
                                        <div className="flex w-full max-w-sm items-center gap-2">
                                            <Input
                                                type="text"
                                                className="bg-white"
                                                placeholder="Search"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                            />
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    router.get(
                                                        `/dashboard/assettypes/${assetType.id}`,
                                                        { search },
                                                        { preserveScroll: true }
                                                    )
                                                }
                                            >
                                                <SearchIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TableHead>
                        </TableRow>
                        <TableRow className="bg-slate-200 hover:bg-slate-200 dark:bg-background dark:hover:bg-background">
                            <TableHead className="text-left pl-8">
                                <Button
                                    variant={
                                        filters.sort_by === "serial_code"
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleSort("serial_code")}
                                >
                                    Serial Code
                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-left">
                                <Button
                                    variant={
                                        filters.sort_by === "brand"
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleSort("brand")}
                                >
                                    Brand
                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-left">
                                <Button
                                    variant={
                                        filters.sort_by === "condition"
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleSort("condition")}
                                >
                                    Condition
                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-left">
                                <Button
                                    variant={
                                        filters.sort_by === "availability"
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleSort("availability")}
                                >
                                    availability
                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right pr-8">
                                <Button
                                    variant={
                                        filters.sort_by === "created_at"
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleSort("created_at")}
                                >
                                    Created At
                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                </Button>
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
                                                    : asset.condition === "used"
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
                                                asset.availability ===
                                                "available"
                                                    ? "bg-green-100 text-green-800"
                                                    : asset.availability ===
                                                      "loaned"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {asset.availability
                                                .charAt(0)
                                                .toUpperCase() +
                                                asset.availability.slice(1)}
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
                                        <div className="absolute bg-[#F2F2F3] right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-2 pr-6">
                                            {permissions.includes(
                                                "edit assets"
                                            ) ? (
                                                <Link
                                                    href={`/dashboard/assets/${asset.id}/edit`}
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
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline">
                            {assets.from}-{assets.to} of {assets.total}
                        </Button>
                        <Select
                            defaultValue={String(assets.per_page)}
                            onValueChange={(value) => {
                                router.get(
                                    `/dashboard/assettypes/${assetType.id}/details`,
                                    {
                                        search,
                                        per_page: value,
                                        sort_by: sortBy,
                                        sort_direction: sortDirection,
                                    },
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
                    </div>

                    <Pagination className="justify-end items-center">
                        <PaginationContent>
                            {assets.prev_page_url && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={assets.prev_page_url}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit(assets.prev_page_url);
                                        }}
                                    />
                                </PaginationItem>
                            )}

                            {assets.next_page_url && (
                                <PaginationItem>
                                    <PaginationNext
                                        href={assets.next_page_url}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit(assets.next_page_url);
                                        }}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div> */}
                </div>
            </div>
        </>
    );
}

AssetsIndex.layout = (page) => <Dashboard children={page} />;

export default AssetsIndex;
