import React from "react";

import { usePage, Link, router } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";

import {
    ChevronLeft,
    Package,
    Filter,
    Pen,
    ArrowUpDown,
    Trash2Icon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@components/ui/table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@components/ui/pagination";

function AssetDetail() {
    const { asset, permissions, log } = usePage().props;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "-";
        }
    };

    const formatDateNoHour = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "-";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-6 py-2">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                    <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-4xl font-semibold">
                            {asset.asset_type?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p-0">
                            {asset.serial_code}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {asset.brand}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {permissions.includes("manage assets") ? (
                        <div className="flex gap-2">
                            <Link href={`/dashboard/assets/${asset.id}/edit`}>
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                >
                                    <Pen className="w-4 h-4" />
                                    Edit
                                </Button>
                            </Link>
                            <DeleteAlertDialog
                                url={`/dashboard/assets/${asset.id}/delete`}
                            >
                                <Button
                                    className="cursor-pointer"
                                    variant="destructive"
                                >
                                    <Trash2Icon className="w-4 h-4" />
                                    Delete
                                </Button>
                            </DeleteAlertDialog>
                        </div>
                    ) : null}
                    <Link href={`/dashboard/assets`}>
                        <Button className="cursor-pointer">
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                </div>
            </div>
            <Card className="p-6 px-8">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                    <Detail label="Specification" value={asset.specification} />
                    <Detail label="Brand" value={asset.brand} />
                    <Detail
                        label="Purchase Price"
                        value={
                            asset.purchase_price
                                ? `Rp${asset.purchase_price}`
                                : "-"
                        }
                    />
                    <DetailBadgeAvaibility
                        label="Availability"
                        value={asset.avaibility}
                    />
                    <DetailBadgeCondition
                        label="Current Condition"
                        value={asset.condition}
                    />
                    <DetailBadgeCondition
                        label="Initial Condition"
                        value={asset.initial_condition}
                    />
                    <Detail
                        label="Created At"
                        value={formatDate(asset.created_at)}
                    />
                    <Detail
                        label="Last Updated"
                        value={formatDate(asset.updated_at)}
                    />
                    <Detail
                        label="Purchase Date"
                        value={formatDateNoHour(asset.purchase_date)}
                    />
                    <Detail label="Location" value={asset.location.address} />
                </div>
            </Card>
            {permissions.includes("audit assets") ? (
                <Card>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-6 py-2">
                                <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                    <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                    Logs
                                </h1>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </Button>
                            </div>

                            <Card>
                                <Table className="border-b">
                                    <TableHeader>
                                        <TableRow className="bg-slate-200 hover:bg-slate-200 dark:bg-background dark:hover:bg-background">
                                            <TableHead className="pl-7">
                                                <Button
                                                    variant="ghost"
                                                    className="cursor-pointer"
                                                >
                                                    Activity Date
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </Button>
                                            </TableHead>

                                            <TableHead className="text-left">
                                                <Button
                                                    variant="ghost"
                                                    className="cursor-pointer"
                                                >
                                                    User
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </Button>
                                            </TableHead>

                                            <TableHead className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    className="cursor-pointer"
                                                >
                                                    Activity Type
                                                    <ArrowUpDown className="w-4 h-4" />
                                                </Button>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {log.data.map((log, index) => (
                                            <TableRow
                                                key={asset.id + "" + index}
                                                className="group relative hover:bg-muted/50"
                                            >
                                                <TableCell className="pl-9">
                                                    {formatDate(
                                                        log.activity_date
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {log.user.name}
                                                </TableCell>
                                                <TableCell className="pr-12 text-right">
                                                    {log.activity_type}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="outline">
                                        {log.from}-{log.to} of {log.total}
                                    </Button>
                                    <Select
                                        defaultValue={String(log.per_page)}
                                        onValueChange={(value) => {
                                            router.get(
                                                `/dashboard/assets/`,
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
                                </div>
                                <Pagination className="justify-end items-center">
                                    <PaginationContent>
                                        {log.prev_page_url && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href={log.prev_page_url}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.visit(
                                                            log.prev_page_url
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}

                                        {log.next_page_url && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    href={log.next_page_url}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.visit(
                                                            log.next_page_url
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}

const Detail = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground">
            {value ?? "-"}
        </p>
    </div>
);

const DetailBadgeAvaibility = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${
                    value === "available"
                        ? "bg-green-100 text-green-800"
                        : value === "loaned"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
        </p>
    </div>
);

const DetailBadgeCondition = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${
                    value === "good" || "new"
                        ? "bg-green-100 text-green-800"
                        : value === "used"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
        </p>
    </div>
);

AssetDetail.layout = (page) => <Dashboard children={page} />;

export default AssetDetail;
