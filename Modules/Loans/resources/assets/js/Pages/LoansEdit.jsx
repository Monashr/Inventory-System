import React from "react";

import { Head, usePage, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import LoansForm from "./LoansForm";

import { PackageOpen, Edit3, ChevronLeft } from "lucide-react";

import { Badge } from "@components/ui/badge";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@components/ui/button";

function LoansEdit() {
    const { assetTypes, users, loan } = usePage().props;

    const getStatusConfig = (status) => {
        const configs = {
            accepted: {
                color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
                label: "Accepted",
            },
            pending: {
                color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
                label: "Pending",
            },
            cancelled: {
                color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
                label: "Cancelled",
            },
            rejected: {
                color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(loan?.status);

    return (
        <>
            <Head title="Loan Edit" />
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-6 py-2">
                    <div className="space-y-4 w-full">
                        <div className="flex items-center justify-between gap-3 w-full">
                            <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                Edit Loans
                            </h1>
                            <Link href="/dashboard/loans">
                                <Button className="cursor-pointer">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                                variant="outline"
                                className={`${statusConfig.color} border px-3 py-1`}
                            >
                                {statusConfig.label}
                            </Badge>

                            {loan?.user && (
                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1"
                                >
                                    Assigned to: {loan.user.name}
                                </Badge>
                            )}

                            {loan?.assets && (
                                <Badge variant="outline" className="px-3 py-1">
                                    {loan.assets.length}{" "}
                                    {loan.assets.length === 1
                                        ? "Asset"
                                        : "Assets"}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {loan?.status !== "pending" && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            This loan has a status of "{statusConfig.label}".
                            Some modifications may not be allowed depending on
                            your permissions and the current loan state.
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader className="border-b border-border/40">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Edit3 className="w-5 h-5" />
                            Loan Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <LoansForm
                            assetTypes={assetTypes}
                            users={users}
                            loan={loan}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LoansEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansEdit;
