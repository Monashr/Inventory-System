import React, { useState, useEffect, useCallback } from "react";

import { useForm, router } from "@inertiajs/react";

import { SaveAll, X, Package, Tag, Info, CheckCircle2, Plus } from "lucide-react";

import { Separator } from "@components/ui/separator";
import { Badge } from "@components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Calendar08 from "@components/calendar-08";

import { toast } from "sonner";

export default function LoansForm({ assetTypes, users, loan }) {
    const { data, setData, processing, errors } = useForm({
        loaner: loan?.user ? String(loan.user.id) : "",
        description: loan?.description || "",
    });

    const [assetEntries, setAssetEntries] = useState(
        loan?.assets?.map((entry) => ({
            asset_type_id: String(entry.asset_type_id),
            asset_id: String(entry.id),
            loaned_date: entry.pivot.loaned_date
                ? new Date(entry.pivot.loaned_date)
                : new Date(),
            assets: [],
            original_asset: entry,
        })) || []
    );

    useEffect(() => {
        const preloadAssetsForEntries = async () => {
            const updatedEntries = await Promise.all(
                assetEntries.map(async (entry) => {
                    if (entry.asset_type_id) {
                        try {
                            const response = await fetch(
                                `/dashboard/assets/api/${
                                    entry.asset_type_id
                                }/assets?loan_id=${loan?.id || ""}`
                            );
                            const assets = await response.json();
                            const matchedAsset = assets.find(
                                (a) => String(a.id) === entry.asset_id
                            );
                            if (!matchedAsset && entry.original_asset) {
                                assets.push(entry.original_asset);
                            }
                            return { ...entry, assets: assets };
                        } catch (error) {
                            console.error(
                                "Failed to fetch assets for type:",
                                entry.asset_type_id,
                                error
                            );
                            return { ...entry, assets: [] };
                        }
                    }
                    return entry;
                })
            );
            setAssetEntries(updatedEntries);
        };

        if (loan?.assets?.length > 0) {
            preloadAssetsForEntries();
        }
    }, [loan]);

    const handleAddAssetEntry = () => {
        setAssetEntries((prev) => [
            ...prev,
            {
                asset_type_id: "",
                asset_id: "",
                loaned_date: new Date(),
                assets: [],
                original_asset: null,
            },
        ]);
    };

    const handleRemoveAssetEntry = (index) => {
        setAssetEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const fetchAssetsForType = useCallback(
        async (assetTypeId, index) => {
            try {
                const response = await fetch(
                    `/dashboard/assets/api/${assetTypeId}/assets?loan_id=${
                        loan?.id || ""
                    }`
                );
                const assets = await response.json();
                setAssetEntries((prev) =>
                    prev.map((entry, i) =>
                        i === index
                            ? {
                                  ...entry,
                                  assets,
                                  asset_id: "",
                                  original_asset: null,
                              }
                            : entry
                    )
                );
            } catch (error) {
                console.error("Failed to fetch assets:", error);
                toast.error("Failed to load assets for selected type.");
            }
        },
        [loan]
    );

    const handleAssetTypeChange = async (index, assetTypeId) => {
        setAssetEntries((prev) =>
            prev.map((entry, i) =>
                i === index ? { ...entry, asset_type_id: assetTypeId } : entry
            )
        );
        await fetchAssetsForType(assetTypeId, index);
    };

    const handleAssetChange = (index, assetId) => {
        setAssetEntries((prev) =>
            prev.map((entry, i) => {
                if (i === index) {
                    const selectedAsset = entry.assets.find(
                        (a) => String(a.id) === assetId
                    );
                    return {
                        ...entry,
                        asset_id: assetId,
                        original_asset: selectedAsset,
                    };
                }
                return entry;
            })
        );
    };

    const handleDateFieldChange = (index, value) => {
        setAssetEntries((prev) =>
            prev.map((entry, i) =>
                i === index ? { ...entry, loaned_date: value } : entry
            )
        );
    };

    const getSelectedAssetIds = (excludeIndex) => {
        return assetEntries
            .filter((_, idx) => idx !== excludeIndex)
            .map((entry) => entry.asset_id);
    };

    const formatDateForPayload = (date) => {
        if (!(date instanceof Date)) return null;
        return date.toISOString().slice(0, 10);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payloadAssets = assetEntries.map((entry) => ({
            asset_type_id: entry.asset_type_id,
            asset_id: entry.asset_id,
            loaned_date: formatDateForPayload(entry.loaned_date),
        }));

        const url = `/dashboard/loans/${loan.id}`;
        router.put(
            url,
            {
                loaner: data.loaner,
                description: data.description,
                assets: payloadAssets,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Loan updated successfully!");
                },
                onError: (formErrors) => {
                    console.error("Form submission errors:", formErrors);
                    toast.error(
                        "Failed to update loan. Please check the form for errors."
                    );
                },
            }
        );
    };

    const getConditionConfig = (condition) => {
        const configs = {
            good: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
            used: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
            defect: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        };
        return configs[condition] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    if (!assetTypes || assetTypes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <Package className="w-16 h-16 text-gray-300" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    No Asset Types Available
                </p>
                <p className="text-sm text-gray-500">
                    Please add asset types to create a loan.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="loaner">Loaner</Label>
                    <Select
                        value={data.loaner}
                        onValueChange={(val) => setData("loaner", val)}
                    >
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem
                                    className="cursor-pointer"
                                    key={user.id}
                                    value={String(user.id)}
                                >
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.loaner && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.loaner}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        placeholder="Optional loan description"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>
            </div>

            <Card className="shadow-sm border">
                <CardHeader className="border-b border-border/40 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Loaned Assets
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {assetEntries.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-3 py-8">
                            <PackageOpen className="w-12 h-12 text-gray-300" />
                            <p className="text-sm text-muted-foreground">
                                No assets added yet. Click "Add Asset" to begin.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {assetEntries.map((entry, index) => (
                            <Card
                                key={index}
                                className="relative border border-gray-200 dark:border-gray-800"
                            >
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-3 right-3 text-muted-foreground hover:text-destructive cursor-pointer"
                                    onClick={() =>
                                        handleRemoveAssetEntry(index)
                                    }
                                >
                                    <X className="w-4 h-4" />
                                    <span className="sr-only">
                                        Remove Asset {index + 1}
                                    </span>
                                </Button>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Asset {index + 1}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Asset Type</Label>
                                        <Select
                                            value={entry.asset_type_id}
                                            onValueChange={(val) =>
                                                handleAssetTypeChange(
                                                    index,
                                                    val
                                                )
                                            }
                                            disabled={
                                                loan?.status !== "pending" &&
                                                entry.original_asset
                                            }
                                        >
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue placeholder="Select asset type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assetTypes.map((assetType) => (
                                                    <SelectItem
                                                        className="cursor-pointer"
                                                        key={assetType.id}
                                                        value={String(
                                                            assetType.id
                                                        )}
                                                    >
                                                        {assetType.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors[
                                            `assets.${index}.asset_type_id`
                                        ] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    errors[
                                                        `assets.${index}.asset_type_id`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Asset</Label>
                                        <Select
                                            value={entry.asset_id}
                                            onValueChange={(val) =>
                                                handleAssetChange(index, val)
                                            }
                                            disabled={
                                                !entry.assets.length ||
                                                (loan?.status !== "pending" &&
                                                    entry.original_asset)
                                            }
                                        >
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue placeholder="Select asset" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {entry.assets
                                                    .filter((asset) => {
                                                        const selectedIds =
                                                            getSelectedAssetIds(
                                                                index
                                                            );
                                                        return (
                                                            !selectedIds.includes(
                                                                String(asset.id)
                                                            ) ||
                                                            String(asset.id) ===
                                                                entry.asset_id
                                                        );
                                                    })
                                                    .map((asset) => (
                                                        <SelectItem
                                                            className="cursor-pointer"
                                                            key={asset.id}
                                                            value={String(
                                                                asset.id
                                                            )}
                                                        >
                                                            {asset.serial_code}{" "}
                                                            ({asset.brand})
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {errors[`assets.${index}.asset_id`] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    errors[
                                                        `assets.${index}.asset_id`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Loaned Date</Label>
                                        <Calendar08
                                            value={entry.loaned_date}
                                            onChange={(val) =>
                                                handleDateFieldChange(
                                                    index,
                                                    val
                                                )
                                            }
                                            className="w-full"
                                        />
                                        {errors[
                                            `assets.${index}.loaned_date`
                                        ] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    errors[
                                                        `assets.${index}.loaned_date`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {entry.original_asset && (
                                        <div className="md:col-span-3 pt-4">
                                            <Separator className="mb-4" />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-accent/30 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        Brand:
                                                    </span>
                                                    <span className="text-sm text-foreground">
                                                        {entry.original_asset
                                                            .brand || "-"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        Specification:
                                                    </span>
                                                    <span className="text-sm text-foreground">
                                                        {entry.original_asset
                                                            .specification ||
                                                            "-"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        Condition:
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${getConditionConfig(
                                                            entry.original_asset
                                                                .condition
                                                        )}`}
                                                    >
                                                        {entry.original_asset.condition
                                                            ?.charAt(0)
                                                            .toUpperCase() +
                                                            entry.original_asset.condition?.slice(
                                                                1
                                                            ) || "-"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddAssetEntry}
                        variant="outline"
                        className="w-full md:w-auto cursor-pointer bg-transparent"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Asset
                    </Button>
                </CardContent>
            </Card>

            <div className="pt-4 w-full flex justify-end items-center">
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full md:w-auto cursor-pointer"
                >
                    {processing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <SaveAll className="w-4 h-4 mr-2" /> Save Loan
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
