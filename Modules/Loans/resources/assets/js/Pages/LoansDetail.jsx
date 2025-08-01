import React, { useState, useEffect, useRef } from "react";

import { Link, usePage, router } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import {
    Ban,
    ChevronLeft,
    ChevronRight,
    CircleSlash,
    PackageOpen,
    Pencil,
    Plus,
    Check,
    FileImage,
    Image,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Calendar08 from "@components/calendar-08";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@components/ui/input";

function LoansDetail() {
    const { loan, flash } = usePage().props;

    const evidentInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const [openDialogIndex, setOpenDialogIndex] = useState(null);
    const [returnDates, setReturnDates] = useState([]);
    const [returnConditions, setReturnConditions] = useState([]);

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

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const isAnyAssetUnavailable = loan.assets.some(
        (asset) =>
            asset.avaibility === "loaned" || asset.avaibility === "defect"
    );

    function handleEvidentChange(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            router.post(`/dashboard/loans/${loan.id}/evident`, formData, {
                forceFormData: true,
                onSuccess: () => {},
                onError: () => {},
            });
        }
    }

    function handleDocumentChange(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            router.post(`/dashboard/loans/${loan.id}/document`, formData, {
                forceFormData: true,
                onSuccess: () => {},
                onError: () => {},
            });
        }
    }

    return (
        <div>
            <Card className="w-full mx-auto border border-gray-200 shadow-md rounded-2xl bg-white">
                <CardContent className="px-12 py-6 space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <h1 className="flex items-center text-3xl font-extrabold text-gray-900">
                                <PackageOpen className="w-10 h-10 mr-3" />
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
                                <input
                                    type="file"
                                    accept=".pdf"
                                    ref={documentInputRef}
                                    onChange={handleDocumentChange}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    data-modal-trigger="upload-evident"
                                    onClick={() =>
                                        documentInputRef.current?.click()
                                    }
                                    className="cursor-pointer w-full h-full py-2 px-4"
                                >
                                    <Plus />
                                    Upload Document
                                </Button>
                            </div>
                            <div>
                                <Link href={`/dashboard/loans/${loan.id}/edit`}>
                                    <Button
                                        variant="outline"
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
                                        <ChevronLeft />
                                        Back
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
                                            <div className="flex items-center gap-2">
                                                {index + 1}.{" "}
                                                {entry.asset_type?.name} (
                                                {entry.serial_code})
                                                {entry.pivot.loaned_status ===
                                                "loaned" ? (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                                        Loaned
                                                    </span>
                                                ) : entry.pivot
                                                      .loaned_status ===
                                                  "returned" ? (
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                                        Returned
                                                    </span>
                                                ) : null}
                                                {entry.avaibility ===
                                                    "defect" && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                                        Defective
                                                    </span>
                                                )}
                                                {entry.deleted_at && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                                        Asset Deleted
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2 justify-center items-center">
                                                {loan.status === "accepted" &&
                                                    entry.pivot
                                                        .loaned_status ===
                                                        "loaned" && (
                                                        <Dialog
                                                            open={
                                                                openDialogIndex ===
                                                                index
                                                            }
                                                            onOpenChange={(
                                                                open
                                                            ) =>
                                                                setOpenDialogIndex(
                                                                    open
                                                                        ? index
                                                                        : null
                                                                )
                                                            }
                                                        >
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className="text-sm cursor-pointer"
                                                                    onClick={() =>
                                                                        setOpenDialogIndex(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    Return Asset
                                                                </Button>
                                                            </DialogTrigger>

                                                            <DialogContent className="space-y-6">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Return
                                                                        Asset
                                                                    </DialogTitle>
                                                                </DialogHeader>

                                                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                                                    <div className="flex flex-col space-y-2 min-w-[220px]">
                                                                        <Label className="text-sm">
                                                                            Return
                                                                            Date
                                                                        </Label>
                                                                        <Calendar08
                                                                            value={
                                                                                returnDates[
                                                                                    index
                                                                                ] ||
                                                                                null
                                                                            }
                                                                            onChange={(
                                                                                val
                                                                            ) => {
                                                                                const updated =
                                                                                    [
                                                                                        ...returnDates,
                                                                                    ];
                                                                                updated[
                                                                                    index
                                                                                ] =
                                                                                    val;
                                                                                setReturnDates(
                                                                                    updated
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    <div className="flex flex-col space-y-2 min-w-[160px]">
                                                                        <Label className="text-sm">
                                                                            Condition
                                                                        </Label>
                                                                        <Select
                                                                            value={
                                                                                returnConditions[
                                                                                    index
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                            onValueChange={(
                                                                                val
                                                                            ) => {
                                                                                const updated =
                                                                                    [
                                                                                        ...returnConditions,
                                                                                    ];
                                                                                updated[
                                                                                    index
                                                                                ] =
                                                                                    val;
                                                                                setReturnConditions(
                                                                                    updated
                                                                                );
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="cursor-pointer">
                                                                                <SelectValue placeholder="Select Condition" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem
                                                                                    value="good"
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    Good
                                                                                </SelectItem>
                                                                                <SelectItem
                                                                                    value="used"
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    Used
                                                                                </SelectItem>
                                                                                <SelectItem
                                                                                    value="defect"
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    Defect
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <DialogDescription>
                                                                    Please,
                                                                    Select the
                                                                    date asset
                                                                    returned and
                                                                    asset
                                                                    condition
                                                                </DialogDescription>

                                                                <DialogFooter>
                                                                    <Button
                                                                        className="w-full cursor-pointer"
                                                                        onClick={() =>
                                                                            router.post(
                                                                                `/dashboard/loans/${loan.id}/return`,
                                                                                {
                                                                                    asset_id:
                                                                                        entry.id,
                                                                                    return_date:
                                                                                        returnDates[
                                                                                            index
                                                                                        ],
                                                                                    return_condition:
                                                                                        returnConditions[
                                                                                            index
                                                                                        ],
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        Submit
                                                                        Return
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}

                                                {!entry.deleted_at && (
                                                    <Link
                                                        href={`/dashboard/assets/${entry.pivot?.asset_id}/details`}
                                                    >
                                                        <Button className="cursor-pointer">
                                                            Asset Details{" "}
                                                            <ChevronRight />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
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
                                                        entry.pivot.return_date
                                                            ? "bg-gray-100 border-gray-200 text-gray-700"
                                                            : "bg-red-50 border-red-200 text-red-600 font-semibold"
                                                    }`}
                                                >
                                                    {formatDateNoHour(
                                                        entry.pivot.return_date
                                                    ) === "-"
                                                        ? "Not Returned Yet"
                                                        : formatDateNoHour(
                                                              entry.pivot
                                                                  .return_date
                                                          )}
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Return Condition
                                                </Label>
                                                <div
                                                    className={`mt-1 p-2 rounded text-sm border ${
                                                        entry.pivot
                                                            .return_condition
                                                            ? "bg-gray-100 border-gray-200 text-gray-700"
                                                            : "bg-red-50 border-red-200 text-red-600 font-semibold"
                                                    }`}
                                                >
                                                    {entry.pivot
                                                        .return_condition ||
                                                        "Not Returned Yet"}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                    <Separator />

                    {!loan.evident ? (
                        <div className="w-full">
                            <Button
                                variant="outline"
                                data-modal-trigger="upload-evident"
                                onClick={() => evidentInputRef.current?.click()}
                                className="cursor-pointer w-full h-32"
                            >
                                <Image />
                                Upload Evident
                            </Button>
                            <input
                                type="file"
                                accept=".png,.jpeg,.jpg,.hvec"
                                ref={evidentInputRef}
                                onChange={handleEvidentChange}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="w-full flex flex-col justify-center items-center p-2 gap-4">
                                <img
                                    src={`/storage/${loan.evident}`}
                                    alt="evident"
                                />
                                <Button
                                    variant="outline"
                                    data-modal-trigger="upload-evident"
                                    onClick={() =>
                                        evidentInputRef.current?.click()
                                    }
                                    className="cursor-pointer"
                                >
                                    <Pencil />
                                    Change Evident Image
                                </Button>
                                <input
                                    type="file"
                                    accept=".png,.jpeg,.jpg,.hvec"
                                    ref={evidentInputRef}
                                    onChange={handleEvidentChange}
                                    className="hidden"
                                />
                            </div>
                            <Separator />
                        </>
                    )}

                    {!["cancelled", "rejected", "accepted"].includes(
                        loan.status
                    ) && (
                        <div className="flex justify-end items-center gap-2">
                            <Button
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() =>
                                    router.post(
                                        `/dashboard/loans/${loan.id}/cancel`
                                    )
                                }
                            >
                                Cancel
                                <CircleSlash />
                            </Button>
                            <Button
                                className="cursor-pointer"
                                variant="destructive"
                                onClick={() =>
                                    router.post(
                                        `/dashboard/loans/${loan.id}/reject`
                                    )
                                }
                            >
                                Reject
                                <Ban />
                            </Button>
                            <Button
                                className="cursor-pointer"
                                disabled={isAnyAssetUnavailable}
                                onClick={() =>
                                    router.post(
                                        `/dashboard/loans/${loan.id}/accept`
                                    )
                                }
                            >
                                Accept
                                <Check />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

LoansDetail.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansDetail;
