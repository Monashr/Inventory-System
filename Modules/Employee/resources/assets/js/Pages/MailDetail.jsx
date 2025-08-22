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

function MailDetail() {
    const { mail, user } = usePage().props;

    // const inboxIndexLogic = useInboxIndex();

    console.log(mail);

    return (
        <>
            <Head title="Inbox" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <Mail className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Mail Detail
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

                    <Card className="px-6 py-2">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Detail label="Sender" value={mail.sender_name} />
                        </div>
                        {mail.status === "pending" &&
                        mail.receiver_name == user.name ? (
                            <div className="flex justify-end items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        router.post(
                                            `/dashboard/inbox/accept/${mail.id}`
                                        )
                                    }
                                    className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                                >
                                    Accept
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        router.delete(
                                            `/dashboard/inbox/decline/${mail.id}`
                                        )
                                    }
                                    className="hover:bg-red-100 hover:text-red-500 cursor-pointer"
                                >
                                    Decline
                                </Button>
                            </div>
                        ) : (
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    mail.status === "accepted"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {mail.status.charAt(0).toUpperCase() +
                                    mail.status.slice(1)}
                            </span>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}

const Detail = ({ label, value }) => (
    <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground">
            {value ?? "-"}
        </p>
    </div>
);

MailDetail.layout = (page) => <Dashboard>{page}</Dashboard>;

export default MailDetail;
