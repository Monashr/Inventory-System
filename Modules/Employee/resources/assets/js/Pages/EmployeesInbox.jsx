import React from "react";

import { router, Link, usePage, Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import {
    Mail,
    ChevronLeft,
    SearchIcon,
    Filter,
    ArrowUpDown,
} from "lucide-react";

import { Input } from "@components/ui/input";
import { Card } from "@/components/ui/card";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import useInboxIndex from "../Hooks/useInboxIndex";

import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";

function EmployeesInbox() {
    const inboxIndexLogic = useInboxIndex();

    return (
        <>
            <Head title="Inbox" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <Mail className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Inbox
                            </h1>
                            <div className="grid grid-cols-1 gap-2 sm:flex">
                                <Link href="/dashboard">
                                    <Button
                                        data-modal-trigger="inbox"
                                        className="cursor-pointer w-full h-full"
                                    >
                                        <ChevronLeft />
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <CustomDataTable
                            columns={inboxIndexLogic.columns}
                            data={inboxIndexLogic.inbox.data}
                            onRowClick={inboxIndexLogic.onRowClick}
                            onSort={inboxIndexLogic.handleSort}
                            filters={inboxIndexLogic.filters}
                            noItem="Inbox"
                        />
                    </Card>
                    <CustomPagination
                        data={inboxIndexLogic.inbox}
                        onPaginationChange={inboxIndexLogic.onPaginationChange}
                    />
                </div>
            </div>
        </>
    );
}

EmployeesInbox.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesInbox;
