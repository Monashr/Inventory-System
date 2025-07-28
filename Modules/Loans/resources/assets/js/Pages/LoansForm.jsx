import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

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
import { SaveAll, X } from "lucide-react";
import Calendar08 from "@components/calendar-08";

export default function LoansForm({ assetTypes, users, loan }) {
    const { data, setData, processing } = useForm({
        loaner: loan?.user ? String(loan.user.id) : "",
        description: loan?.description || "",
    });

    const [assetEntries, setAssetEntries] = useState(
        loan?.assets?.map((entry) => ({
            asset_type_id: String(entry.asset_type_id),
            asset_id: String(entry.id),
            loaned_date: entry.pivot.loaned_date
                ? new Date(entry.pivot.loaned_date)
                : "",
            assets: [],
        })) || []
    );

    useEffect(() => {
        async function preloadAssets() {
            if (!loan?.assets) return;

            const entriesWithAssets = await Promise.all(
                loan.assets.map(async (entry) => {
                    const response = await fetch(
                        `/dashboard/assets/api/${entry.asset_type_id}/assets`
                    );
                    const assets = await response.json();

                    const matchedAsset = assets.find((a) => a.id === entry.id);

                    if (!matchedAsset) {
                        assets.push({
                            id: entry.id,
                            serial_code: entry.serial_code,
                        });
                    }

                    return {
                        asset_type_id: String(entry.asset_type_id),
                        asset_id: String(entry.id),
                        loaned_date: entry.pivot.loaned_date
                            ? new Date(entry.pivot.loaned_date)
                            : "",
                        assets,
                    };
                })
            );

            setAssetEntries(entriesWithAssets);
        }

        preloadAssets();
    }, []);

    const handleAddAssetEntry = () => {
        setAssetEntries((prev) => [
            ...prev,
            {
                asset_type_id: "",
                asset_id: "",
                loaned_date: "",
                assets: [],
            },
        ]);
    };

    const handleRemoveAssetEntry = (index) => {
        setAssetEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const fetchAssets = async (assetTypeId, index) => {
        try {
            const response = await fetch(
                `/dashboard/assets/api/${assetTypeId}/assets`
            );
            const assets = await response.json();

            setAssetEntries((prev) =>
                prev.map((entry, i) =>
                    i === index ? { ...entry, assets, asset_id: "" } : entry
                )
            );
        } catch (error) {
            console.error("Failed to fetch assets:", error);
        }
    };

    const handleAssetTypeChange = async (index, assetTypeId) => {
        setAssetEntries((prev) =>
            prev.map((entry, i) =>
                i === index ? { ...entry, asset_type_id: assetTypeId } : entry
            )
        );
        await fetchAssets(assetTypeId, index);
    };

    const handleFieldChange = (index, field, value) => {
        setAssetEntries((prev) =>
            prev.map((entry, i) =>
                i === index ? { ...entry, [field]: value } : entry
            )
        );
    };

    const getSelectedAssetIds = (excludeIndex) => {
        return assetEntries
            .filter((_, idx) => idx !== excludeIndex)
            .map((entry) => entry.asset_id)
            .filter((id) => id);
    };

    const formatDateLocal = (date) => {
        if (!(date instanceof Date)) return null;

        return date.toLocaleDateString("en-CA");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payloadAssets = assetEntries.map((entry) => ({
            asset_type_id: entry.asset_type_id,
            asset_id: entry.asset_id,
            loaned_date: formatDateLocal(entry.loaned_date),
        }));

        const url = loan ? `/dashboard/loans/${loan.id}` : `/dashboard/loans`;

        if (loan) {
            router.put(
                url,
                {
                    loaner: data.loaner,
                    description: data.description,
                    assets: payloadAssets,
                },
                { preserveScroll: true }
            );
        } else {
            router.post(
                url,
                {
                    loaner: data.loaner,
                    description: data.description,
                    assets: payloadAssets,
                },
                { preserveScroll: true }
            );
        }
    };

    if (assetTypes.length == 0) {
        return <div>No asset types available.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 p-6">
            <div className="grid grid-cols-1 gap-6">
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
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                </div>
            </div>

            <Card className="bg-slate-100 shadow-md">
                <CardContent>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Loaned Assets</h2>

                        {assetEntries.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No assets added yet. Click &quot;Add Asset&quot;
                                to begin.
                            </p>
                        )}

                        <div className="space-y-6">
                            {assetEntries.map((entry, index) => (
                                <Card key={index} className="relative">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
                                        onClick={() =>
                                            handleRemoveAssetEntry(index)
                                        }
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>

                                    <CardHeader>
                                        <CardTitle>Asset {index + 1}</CardTitle>
                                    </CardHeader>

                                    <CardContent className="flex justify-between gap-4">
                                        <div className="w-2/3">
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
                                                >
                                                    <SelectTrigger className="w-full cursor-pointer">
                                                        <SelectValue placeholder="Select asset type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {assetTypes.map(
                                                            (assetType) => (
                                                                <SelectItem
                                                                    className="cursor-pointer"
                                                                    key={
                                                                        assetType.id
                                                                    }
                                                                    value={String(
                                                                        assetType.id
                                                                    )}
                                                                >
                                                                    {
                                                                        assetType.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Asset</Label>
                                                <Select
                                                    value={entry.asset_id}
                                                    onValueChange={(val) =>
                                                        handleFieldChange(
                                                            index,
                                                            "asset_id",
                                                            val
                                                        )
                                                    }
                                                    disabled={
                                                        !entry.assets.length
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
                                                                        String(
                                                                            asset.id
                                                                        )
                                                                    ) ||
                                                                    String(
                                                                        asset.id
                                                                    ) ===
                                                                        entry.asset_id
                                                                );
                                                            })
                                                            .map((asset) => (
                                                                <SelectItem
                                                                    className="cursor-pointer"
                                                                    key={
                                                                        asset.id
                                                                    }
                                                                    value={String(
                                                                        asset.id
                                                                    )}
                                                                >
                                                                    {
                                                                        asset.serial_code
                                                                    }
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="pt-4 space-y-1 text-sm text-muted-foreground">
                                                {(() => {
                                                    const selectedAsset =
                                                        entry.assets.find(
                                                            (a) =>
                                                                String(a.id) ===
                                                                entry.asset_id
                                                        );

                                                    if (!selectedAsset)
                                                        return null;

                                                    return (
                                                        <>
                                                            <div className="space-y-2 p-2 bg-accent rounded-2xl">
                                                                <div className="w-full flex justify-between items-center">
                                                                    <span className="font-bold text-foreground">
                                                                        Condition:
                                                                    </span>{" "}
                                                                    <div
                                                                        className={`border px-2 rounded-2xl text-sm ${
                                                                            selectedAsset.condition ===
                                                                            "good"
                                                                                ? "bg-green-50 border-green-200 text-green-600"
                                                                                : selectedAsset.condition ===
                                                                                  "used"
                                                                                ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                                                                                : selectedAsset.condition ===
                                                                                  "defect"
                                                                                ? "bg-red-50 border-red-200 text-red-600"
                                                                                : "bg-red-50 border-red-200 text-red-600"
                                                                        }`}
                                                                    >
                                                                        {selectedAsset.condition ||
                                                                            "-"}
                                                                    </div>
                                                                </div>
                                                                <div className="w-full flex justify-between items-center">
                                                                    <span className="font-bold text-foreground">
                                                                        Brand:
                                                                    </span>{" "}
                                                                    {selectedAsset.brand ||
                                                                        "-"}
                                                                </div>
                                                                <div className="w-full flex justify-between items-center">
                                                                    <span className="font-bold text-foreground">
                                                                        Specification:
                                                                    </span>{" "}
                                                                    {selectedAsset.specification ||
                                                                        "-"}
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="w-1/3 flex justify-center items-center">
                                            <div className="space-y-2 flex flex-col justify-center items-center">
                                                <Label>Loaned Date</Label>
                                                <Calendar08
                                                    value={entry.loaned_date}
                                                    onChange={(val) =>
                                                        handleFieldChange(
                                                            index,
                                                            "loaned_date",
                                                            val
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Button
                            type="button"
                            onClick={handleAddAssetEntry}
                            variant="outline"
                            className="w-full md:w-auto cursor-pointer"
                        >
                            + Add Asset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="pt-4 w-full flex justify-end items-center">
                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full md:w-auto cursor-pointer"
                >
                    Save Loan
                    <SaveAll />
                </Button>
            </div>
        </form>
    );
}
