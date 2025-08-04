import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import Dashboard from "@components/layout/Dashboard";
import {
    Ban,
    ChevronLeft,
    ChevronRight,
    CircleSlash,
    PackageOpen,
    Pencil,
    Check,
    FileImage,
    ImageIcon,
    Calendar,
    User,
    FileText,
    Upload,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    FileIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Calendar08 from "@components/calendar-08";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

function LoansDetail() {
    const { loan, permissions, flash } = usePage().props;
    const evidentInputRef = useRef(null);
    const documentInputRef = useRef(null);
    const [openDialogIndex, setOpenDialogIndex] = useState(null);
    const [returnDates, setReturnDates] = useState([]);
    const [returnConditions, setReturnConditions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

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

    const getStatusConfig = (status) => {
        const configs = {
            accepted: {
                color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
                icon: CheckCircle2,
            },
            pending: {
                color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
                icon: Clock,
            },
            cancelled: {
                color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
                icon: XCircle,
            },
            rejected: {
                color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
                icon: XCircle,
            },
        };
        return configs[status] || configs.pending;
    };

    const getConditionConfig = (condition) => {
        const configs = {
            good: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
            used: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
            defect: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
        };
        return configs[condition] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    function handleEvidentChange(event) {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            router.post(`/dashboard/loans/${loan.id}/evident`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsUploading(false);
                    toast.success("Evidence uploaded successfully");
                },
                onError: () => {
                    setIsUploading(false);
                    toast.error("Failed to upload evidence");
                },
            });
        }
    }

    function handleDocumentChange(event) {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            router.post(`/dashboard/loans/${loan.id}/document`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    setIsUploading(false);
                    toast.success("Document uploaded successfully");
                },
                onError: () => {
                    setIsUploading(false);
                    toast.error("Failed to upload document");
                },
            });
        }
    }

    const statusConfig = getStatusConfig(loan.status);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <Head title={loan.user.name + " " + "Loan"} />
            <div className="space-y-6">
                <div className="px-6 py-2">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                    <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                    Loan Details
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className={`${statusConfig.color} border px-3 py-1`}
                                >
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {loan.status.charAt(0).toUpperCase() +
                                        loan.status.slice(1)}
                                </Badge>

                                <Badge
                                    variant="secondary"
                                    className="px-3 py-1"
                                >
                                    <User className="w-3 h-3 mr-1" />
                                    {loan.user.name}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {loan.status === "pending" && (
                                <Link href={`/dashboard/loans/${loan.id}/edit`}>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit Loan
                                    </Button>
                                </Link>
                            )}

                            <Link href="/dashboard/loans">
                                <Button className="cursor-pointer">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 dark:bg-gray-900 border rounded-lg p-4 min-h-[100px]">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {loan.description || "No description provided."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PackageOpen className="w-5 h-5" />
                            Loaned Assets ({loan.assets.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loan.assets.length === 0 ? (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    No assets have been recorded for this loan.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="grid gap-4">
                                {loan.assets.map((entry, index) => (
                                    <Card
                                        key={entry.id}
                                        className="border border-gray-200 dark:border-gray-800"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {
                                                                entry.asset_type
                                                                    ?.name
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Serial:{" "}
                                                            {entry.serial_code}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    {entry.pivot
                                                        .loaned_status ===
                                                        "loaned" && (
                                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Loaned
                                                        </Badge>
                                                    )}

                                                    {entry.pivot
                                                        .loaned_status ===
                                                        "returned" && (
                                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Returned
                                                        </Badge>
                                                    )}

                                                    {entry.avaibility ===
                                                        "defect" && (
                                                        <Badge variant="destructive">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Defective
                                                        </Badge>
                                                    )}

                                                    {entry.deleted_at && (
                                                        <Badge variant="destructive">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Deleted
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Loaned Date
                                                    </Label>
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm">
                                                            {formatDateNoHour(
                                                                entry.pivot
                                                                    .loaned_date
                                                            ) || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Loaned Condition
                                                    </Label>
                                                    <div
                                                        className={`p-2 rounded-md border text-sm font-medium ${getConditionConfig(
                                                            entry.pivot
                                                                .loaned_condition
                                                        )}`}
                                                    >
                                                        {entry.pivot.loaned_condition
                                                            ?.charAt(0)
                                                            .toUpperCase() +
                                                            entry.pivot.loaned_condition?.slice(
                                                                1
                                                            ) || "N/A"}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Return Date
                                                    </Label>
                                                    <div
                                                        className={`flex items-center gap-2 p-2 rounded-md ${
                                                            entry.pivot
                                                                .return_date
                                                                ? "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                                                                : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                                        }`}
                                                    >
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm">
                                                            {formatDateNoHour(
                                                                entry.pivot
                                                                    .return_date
                                                            ) === "-"
                                                                ? "Not returned"
                                                                : formatDateNoHour(
                                                                      entry
                                                                          .pivot
                                                                          .return_date
                                                                  )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Return Condition
                                                    </Label>
                                                    <div
                                                        className={`p-2 rounded-md text-sm ${
                                                            entry.pivot
                                                                .return_condition
                                                                ? `${getConditionConfig(
                                                                      entry
                                                                          .pivot
                                                                          .return_condition
                                                                  )} border font-medium`
                                                                : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                                        }`}
                                                    >
                                                        {entry.pivot
                                                            .return_condition ||
                                                            "Not returned"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2">
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
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                    Return Asset
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md">
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Return
                                                                        Asset
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Select
                                                                        the
                                                                        return
                                                                        date and
                                                                        condition
                                                                        for this
                                                                        asset.
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <div className="space-y-4">
                                                                    <div className="space-y-2">
                                                                        <Label>
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

                                                                    <div className="space-y-2">
                                                                        <Label>
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
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select condition" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="good">
                                                                                    Good
                                                                                </SelectItem>
                                                                                <SelectItem value="used">
                                                                                    Used
                                                                                </SelectItem>
                                                                                <SelectItem value="defect">
                                                                                    Defect
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>

                                                                <DialogFooter>
                                                                    <Button
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
                                                                        disabled={
                                                                            !returnDates[
                                                                                index
                                                                            ] ||
                                                                            !returnConditions[
                                                                                index
                                                                            ]
                                                                        }
                                                                        className="w-full"
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
                                                        <Button
                                                            size="sm"
                                                            className="cursor-pointer"
                                                        >
                                                            View Details
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {permissions.includes("making loan decision") && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileImage className="w-5 h-5" />
                                Evidence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-medium">
                                    Evidence Photo
                                </Label>
                                {!loan.evident ? (
                                    <div
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer"
                                        onClick={() =>
                                            evidentInputRef.current?.click()
                                        }
                                    >
                                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Click to upload evidence photo
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPEG, JPG up to 10MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center gap-2">
                                        <div>
                                            <img
                                                src={`/storage/${loan.evident}`}
                                                alt="Evidence"
                                                className="max-w-full h-auto max-h-64 rounded-lg border"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                evidentInputRef.current?.click()
                                            }
                                            disabled={isUploading}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            {isUploading
                                                ? "Uploading..."
                                                : "Change Evidence"}
                                        </Button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept=".png,.jpeg,.jpg,.heic"
                                    ref={evidentInputRef}
                                    onChange={handleEvidentChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-medium">
                                    Document {console.log(loan.document)}
                                </Label>
                                {!loan.document &&
                                permissions.includes("making loan decision") ? (
                                    <div
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer"
                                        onClick={() =>
                                            documentInputRef.current?.click()
                                        }
                                    >
                                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Click to upload document
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPEG, JPG up to 10MB
                                        </p>
                                    </div>
                                ) : (
                                    <a href={`/storage/${loan.document}`}>
                                        <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer">
                                            <FileIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Click to download document
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {loan.document}
                                            </p>
                                        </div>
                                    </a>
                                )}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    ref={documentInputRef}
                                    onChange={handleDocumentChange}
                                    className="hidden"
                                />
                            </div>

                            {!["cancelled", "rejected", "accepted"].includes(
                                loan.status
                            ) && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <Label className="text-sm font-medium">
                                            Loan Decision
                                        </Label>
                                        {isAnyAssetUnavailable && (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    Some assets are unavailable.
                                                    Please resolve asset
                                                    availability before
                                                    accepting this loan.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    router.post(
                                                        `/dashboard/loans/${loan.id}/cancel`
                                                    )
                                                }
                                                className="cursor-pointer"
                                            >
                                                <CircleSlash className="w-4 h-4 mr-1" />
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    router.post(
                                                        `/dashboard/loans/${loan.id}/reject`
                                                    )
                                                }
                                                className="cursor-pointer"
                                            >
                                                <Ban className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                            <Button
                                                disabled={isAnyAssetUnavailable}
                                                onClick={() =>
                                                    router.post(
                                                        `/dashboard/loans/${loan.id}/accept`
                                                    )
                                                }
                                                className="cursor-pointer"
                                            >
                                                <Check className="w-4 h-4 mr-1" />
                                                Accept
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

LoansDetail.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansDetail;
