import React from "react";

import { Head, useForm, Link, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";

import { Package, Save, ChevronLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import NoAssetType from "../Components/AssetType/NoAssetType";

function AssetCreate() {
    const { assetTypes, brands } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        asset_type_id: "",
        brand: "",
        specification: "",
        purchase_date: "",
        purchase_price: "",
        initial_condition: "new",
        condition: "good",
        availability: "available",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/assets/add", {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Add Asset" />
            <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                            <Package className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                            Add Assets
                        </h1>
                        <div className="grid grid-cols-1 gap-2 sm:flex">
                            <Link href="/dashboard/assets">
                                <Button className="cursor-pointer h-full w-full">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                <Card className="px-6 py-8 space-y-2">
                    {!assetTypes || assetTypes.length === 0 ? (
                        <NoAssetType text={"Asset"} />
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="asset_type_id">
                                        Asset Type
                                    </Label>
                                    <Select
                                        value={data.asset_type_id}
                                        onValueChange={(value) => {
                                            const selectedType =
                                                assetTypes.find(
                                                    (type) =>
                                                        String(type.id) ===
                                                        value
                                                );

                                            const now = Date.now();
                                            const slug = selectedType?.code
                                                ?.toLowerCase()
                                                ?.replace(/\s+/g, "-")
                                                ?.replace(/[^\w\-]+/g, "");

                                            const serial = `${slug}-${now}`;

                                            setData("asset_type_id", value);
                                            setData("serial_code", serial);
                                        }}
                                    >
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder="Select Asset Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assetTypes.map((type) => (
                                                <SelectItem
                                                    className="cursor-pointer"
                                                    key={type.id}
                                                    value={String(type.id)}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.asset_type_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.asset_type_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serial_code">
                                        Serial Code
                                    </Label>
                                    <Input
                                        type="text"
                                        id="serial_code"
                                        disabled
                                        value={data.serial_code ?? ""}
                                    />
                                    {errors.serial_code && (
                                        <p className="text-sm text-red-500">
                                            {errors.serial_code}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <ComboBoxInput
                                        id="brand"
                                        options={brands}
                                        value={data.brand}
                                        onChange={(value) =>
                                            setData("brand", value)
                                        }
                                        placeholder=""
                                    />

                                    {errors.brand && (
                                        <p className="text-sm text-red-500">
                                            {errors.brand}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="purchase_price">
                                        Purchase Price
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        id="purchase_price"
                                        value={data.purchase_price}
                                        onChange={(e) =>
                                            setData(
                                                "purchase_price",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.purchase_price && (
                                        <p className="text-sm text-red-500">
                                            {errors.purchase_price}
                                        </p>
                                    )}
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="specification">
                                        Specification
                                    </Label>
                                    <Textarea
                                        id="specification"
                                        value={data.specification}
                                        onChange={(e) =>
                                            setData(
                                                "specification",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.specification && (
                                        <p className="text-sm text-red-500">
                                            {errors.specification}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="purchase_date">
                                        Purchase Date
                                    </Label>
                                    <Input
                                        className="cursor-pointer"
                                        type="date"
                                        id="purchase_date"
                                        value={data.purchase_date}
                                        onChange={(e) =>
                                            setData(
                                                "purchase_date",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.purchase_date && (
                                        <p className="text-sm text-red-500">
                                            {errors.purchase_date}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="initial_condition">
                                        Initial Condition
                                    </Label>
                                    <Select
                                        value={data.initial_condition ?? ""}
                                        onValueChange={(value) => {
                                            setData("initial_condition", value);

                                            const conditionMap = {
                                                new: "good",
                                                used: "used",
                                                defect: "defect",
                                            };

                                            setData(
                                                "condition",
                                                conditionMap[value] ?? "good"
                                            );
                                        }}
                                    >
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="new"
                                            >
                                                New
                                            </SelectItem>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="used"
                                            >
                                                Used
                                            </SelectItem>
                                            <SelectItem
                                                className="cursor-pointer"
                                                value="defect"
                                            >
                                                Defect
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="condition">
                                        Current Condition
                                    </Label>
                                    <Select
                                        value={data.condition}
                                        disabled
                                        onValueChange={(value) =>
                                            setData("condition", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
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

                                <div className="space-y-2">
                                    <Label htmlFor="availability">
                                        Availability
                                    </Label>
                                    <Select
                                        value={data.availability}
                                        disabled
                                        onValueChange={(value) =>
                                            setData("availability", value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">
                                                Available
                                            </SelectItem>
                                            <SelectItem value="loaned">
                                                Loaned
                                            </SelectItem>
                                            <SelectItem value="repair">
                                                Repair
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end items-center">
                                <Button
                                    type="submit"
                                    className="cursor-pointer"
                                    disabled={processing}
                                >
                                    Save Asset
                                    <Save className="w-4 h-4 mr-2" />
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </>
    );
}

AssetCreate.layout = (page) => <Dashboard children={page} />;

export default AssetCreate;
