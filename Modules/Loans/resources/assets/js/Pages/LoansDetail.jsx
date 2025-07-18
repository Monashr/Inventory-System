import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Dashboard from "@components/layout/Dashboard";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight, PackageOpen, Pencil, Plus } from "lucide-react";
import { Button } from "@components/ui/button";

function LoansDetail() {
    const { loan } = usePage().props;

    const formatDateNoHour = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return null;
        }
    };

    return (
        <div>
            <Card className="w-full mx-auto border border-gray-200 shadow-md rounded-2xl bg-white">
                <CardContent className="px-12 py-6 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <h1 className="flex items-center text-3xl font-extrabold text-gray-900">
                                <PackageOpen className="w-10 h-10 mr-3 text-primary" />
                                Loan Details
                            </h1>
                            <p className="text-sm text-gray-500">
                                Review details and assets associated with this
                                loan.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <div
                                className={`inline-flex items-center px-4 py-2 rounded-md text-base font-semibold ${
                                    loan.status === "accepted"
                                        ? "bg-green-100 text-green-800"
                                        : loan.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : loan.status === "cancelled"
                                        ? "bg-slate-100 text-slate-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {loan.status.charAt(0).toUpperCase() +
                                    loan.status.slice(1)}
                            </div>

                            <div className=" bg-gray-100 border border-gray-200 text-gray-800 px-4 py-2 rounded-md text-base font-semibold">
                                Loaner {loan.user.name}
                            </div>
                            <div>
                                <Link href="/dashboard/loans">
                                    <Button
                                        data-modal-trigger="add-product"
                                        className="cursor-pointer h-full"
                                    >
                                        Upload Evident
                                        <Plus />
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                <Link href={`/dashboard/loans/${loan.id}/edit`}>
                                    <Button
                                        data-modal-trigger="add-product"
                                        className="cursor-pointer h-full"
                                    >
                                        <Pencil />
                                        Edit Loan
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                <Link href="/dashboard/loans">
                                    <Button
                                        data-modal-trigger="add-product"
                                        className="cursor-pointer h-full"
                                    >
                                        Back
                                        <ChevronRight />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <Label className="text-sm text-gray-600">
                                Description
                            </Label>
                            <div className="mt-2 bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-md leading-relaxed min-h-[80px]">
                                {loan.description}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                            Loaned Assets
                        </h2>

                        {loan.assets.length === 0 ? (
                            <p className="text-muted-foreground text-sm italic">
                                No units recorded for this loan.
                            </p>
                        ) : (
                            loan.assets.map((entry, index) => (
                                <Card
                                    key={entry.id}
                                    className="border border-gray-200 shadow-sm rounded-xl bg-white"
                                >
                                    <CardHeader className="px-6 py-4 rounded-t-xl border-b">
                                        <CardTitle className="flex justify-between items-center text-lg font-bold text-gray-900">
                                            {console.log(entry)}
                                            <div>
                                                {index + 1}.{" "}
                                                {entry.asset_type?.name} (
                                                {entry.serial_code})
                                            </div>
                                            <Link
                                                href={`/dashboard/assets/${entry.pivot?.asset_id}/details`}
                                            >
                                                <Button className="cursor-pointer">
                                                    Asset Details{" "}
                                                    <ChevronRight />
                                                </Button>
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Loaned Date
                                                </Label>
                                                <div className="mt-1 bg-gray-100 border border-gray-200 p-2 rounded text-sm text-gray-700">
                                                    {formatDateNoHour(
                                                        entry.pivot.loaned_date
                                                    ) || "N/A"}
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Loaned Condition
                                                </Label>
                                                <div
                                                    className={`mt-1 border p-2 rounded text-sm ${
                                                        entry.pivot
                                                            .loaned_condition ===
                                                        "good"
                                                            ? "bg-green-50 border-green-200 text-green-600 font-semibold"
                                                            : entry.pivot
                                                                  .loaned_condition ===
                                                              "used"
                                                            ? "bg-yellow-50 border-yellow-200 text-yellow-600 font-semibold"
                                                            : entry.pivot
                                                                  .loaned_condition ===
                                                              "defect"
                                                            ? "bg-red-50 border-red-200 text-red-600 font-semibold"
                                                            : "bg-red-50 border-red-200 text-red-600 font-semibold"
                                                    }`}
                                                >
                                                    {entry.pivot.loaned_condition
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        entry.pivot.loaned_condition.slice(
                                                            1
                                                        ) || "N/A"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Return Date
                                                </Label>
                                                <div
                                                    className={`mt-1 p-2 rounded text-sm border ${
                                                        entry.return_date
                                                            ? "bg-gray-100 border-gray-200 text-gray-700"
                                                            : "bg-red-50 border-red-200 text-red-600 font-semibold"
                                                    }`}
                                                >
                                                    {formatDateNoHour(
                                                        entry.return_date
                                                    ) === "-"
                                                        ? "Not Returned Yet"
                                                        : formatDateNoHour(
                                                              entry.return_date
                                                          )}
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Return Condition
                                                </Label>
                                                <div
                                                    className={`mt-1 p-2 rounded text-sm border ${
                                                        entry.return_date
                                                            ? "bg-gray-100 border-gray-200 text-gray-700"
                                                            : "bg-red-50 border-red-200 text-red-600 font-semibold"
                                                    }`}
                                                >
                                                    {entry.return_condition ||
                                                        "Not Returned Yet"}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

LoansDetail.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansDetail;
