import React from "react";

import { Head, useForm, Link, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";

import { Save, Package, ChevronLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function AssetsEdit() {
    const { asset, assetTypes, brands } = usePage().props;

    const { data, setData, put, errors } = useForm({
        asset_type_id: String(asset.asset_type_id),
        serial_code: asset.serial_code || "",
        brand: asset.brand || "",
        specification: asset.specification || "",
        purchase_date: asset.purchase_date || "",
        purchase_price: asset.purchase_price || "",
        initial_condition: asset.initial_condition || "new",
        condition: asset.condition || "good",
        availability: asset.availability || "available",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard/assets/${asset.id}/edit`);
    };

    return (
        <>
        <Head title="Edit Asset" />
        <div className="space-y-4">
            <div className="flex items-center justify-between px-6 py-2">
                <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p-0">
                    <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                    Edit Asset
                </h1>
                <Link href={`/dashboard/assets/${asset.id}/details`}>
                    <Button className="cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>
                </Link>
            </div>
            <Card className="px-6 py-8 space-y-2">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <div className="space-y-2">
                        <Label htmlFor="asset_type_id">Asset Type</Label>
                        <Select
                            value={data.asset_type_id}
                            disabled
                            onValueChange={(value) =>
                                setData("asset_type_id", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Asset Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {assetTypes.map((type) => (
                                    <SelectItem
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
                        <Label htmlFor="serial_code">Serial Code</Label>
                        <Input
                            type="text"
                            disabled
                            value={data.serial_code}
                            onChange={(e) =>
                                setData("serial_code", e.target.value)
                            }
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
                            onChange={(value) => setData("brand", value)}
                            placeholder=""
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purchase_price">Purchase Price</Label>
                        <Input
                            type="number"
                            value={data.purchase_price}
                            onChange={(e) =>
                                setData("purchase_price", e.target.value)
                            }
                        />
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                        <Label htmlFor="specification">Specification</Label>
                        <Textarea
                            id="specification"
                            value={data.specification}
                            onChange={(e) =>
                                setData("specification", e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="purchase_date">Purchase Date</Label>
                        <Input
                            className="cursor-pointer"
                            type="date"
                            value={data.purchase_date}
                            onChange={(e) =>
                                setData("purchase_date", e.target.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Initial Condition</Label>
                        <Select
                            value={data.initial_condition}
                            disabled
                            onValueChange={(value) => {
                                setData("initial_condition", value);
                                setData(
                                    "condition",
                                    value === "new" ? "good" : value
                                );
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="defect">Defect</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Current Condition</Label>
                        <Select
                            value={data.condition}
                            onValueChange={(value) =>
                                setData("condition", value)
                            }
                        >
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    className="cursor-pointer"
                                    value="good"
                                >
                                    Good
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
                        <Label>Availability</Label>
                        <Select
                            value={data.availability}
                            disabled
                            onValueChange={(value) =>
                                setData("availability", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="available">
                                    Available
                                </SelectItem>
                                <SelectItem value="loaned">Loaned</SelectItem>
                                <SelectItem value="repair">Repair</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end items-center">
                        <Button type="submit" className="cursor-pointer">
                            Update Asset
                            <Save className="w-4 h-4 mr-2" />
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
        </>
    );
}

AssetsEdit.layout = (page) => <Dashboard children={page} />;

export default AssetsEdit;
