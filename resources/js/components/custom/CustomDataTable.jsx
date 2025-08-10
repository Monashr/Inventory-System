import React from "react";

import { ArrowUpDown } from "lucide-react";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

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

function renderCell(column, value) {
    if (column.type === "badge") {
        const color = column.badgeColors?.[value?.toLowerCase()] || "gray";

        const badgeClasses = {
            green: "bg-green-100 text-green-800",
            yellow: "bg-yellow-100 text-yellow-800",
            red: "bg-red-100 text-red-800",
            blue: "bg-blue-100 text-blue-800",
            gray: "bg-gray-100 text-gray-800",
        };

        const className = badgeClasses[color] || badgeClasses.gray;

        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}
            >
                {value?.charAt(0).toUpperCase() + value?.slice(1)}
            </span>
        );
    }

    if (column.type === "time") {
        return formatDate(value);
    }

    return value ?? "-";
}

function CustomDataTable({
    columns = [],
    data = [],
    onSort,
    onRowClick,
    filters,
    noItem,
}) {
    return (
        <>
            <Table className="border-b">
                <TableHeader>
                    <TableRow className="bg-slate-200 hover:bg-slate-200 dark:bg-background dark:hover:bg-background">
                        {columns.map((column, index) => {
                            const isFirst = index === 0;
                            const isLast = index === columns.length - 1;

                            return (
                                <TableHead
                                    key={column.key}
                                    className={`${isFirst ? "pl-9" : ""} ${
                                        isLast ? "pr-11 text-right" : ""
                                    }`}
                                >
                                    <Button
                                        variant={
                                            filters.sort_by === column.key
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="cursor-pointer"
                                        onClick={() => onSort(column.key)}
                                    >
                                        {column.label}
                                        <ArrowUpDown className="w-4 h-4 ml-2" />
                                    </Button>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <TableRow
                                key={item.id}
                                className="group relative hover:bg-muted cursor-pointer"
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === columns.length - 1;

                                    return (
                                        <TableCell
                                            key={column.key}
                                            className={`${
                                                isFirst ? "pl-10" : ""
                                            } ${
                                                isLast ? "pr-10 text-right" : ""
                                            }`}
                                        >
                                            {renderCell(
                                                column,
                                                item[column.key]
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="text-center py-12 px-6"
                            >
                                <div className="flex flex-col gap-4">
                                    <img
                                        src="/NoExist.svg"
                                        alt="no exist"
                                        className="max-w-60 m-auto"
                                    />
                                    <div>
                                        <h1 className="font-bold">
                                            No {noItem} Found.
                                        </h1>
                                        <p className="font-light">
                                            Add {noItem} or try searching with
                                            different keyword
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

export default CustomDataTable;
