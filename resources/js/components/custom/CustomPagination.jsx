
import React from "react";

import { router } from "@inertiajs/react";

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

import { Button } from "@components/ui/button";

function CustomPagination({data, onPaginationChange}) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-center gap-2 bg-card p-2 rounded-3xl shadow">
                <Button variant="outline">
                    {data.from}-{data.to} of {data.total}
                </Button>

                <Select
                    defaultValue={String(data.per_page)}
                    onValueChange={onPaginationChange}
                >
                    <SelectTrigger className="w-[180px] cursor-pointer">
                        <SelectValue placeholder="Select a value" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10" className="cursor-pointer">
                            10
                        </SelectItem>
                        <SelectItem value="25" className="cursor-pointer">
                            25
                        </SelectItem>
                        <SelectItem value="50" className="cursor-pointer">
                            50
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Pagination className="justify-end items-center">
                <PaginationContent>
                    {data.prev_page_url && (
                        <PaginationItem className="bg-card shadow rounded-3xl">
                            <PaginationPrevious
                                href={data.prev_page_url}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.visit(data.prev_page_url);
                                }}
                            />
                        </PaginationItem>
                    )}

                    {data.next_page_url && (
                        <PaginationItem className="bg-card shadow rounded-3xl">
                            <PaginationNext
                                href={data.next_page_url}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.visit(data.next_page_url);
                                }}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export default CustomPagination;