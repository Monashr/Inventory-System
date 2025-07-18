import React, { useEffect } from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import Dashboard from "@components/layout/Dashboard";
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
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";

function AssetsEdit() {
    const { asset, assetTypes } = usePage().props;

    console.log(asset);

    const { data, setData, put, errors } = useForm({
        asset_type_id: String(asset.asset_type_id),
        serial_code: asset.serial_code || "",
        brand: asset.brand || "",
        specification: asset.specification || "",
        purchase_date: asset.purchase_date || "",
        purchase_price: asset.purchase_price || "",
        initial_condition: asset.initial_condition || "new",
        condition: asset.condition || "good",
        avaibility: asset.avaibility || "available",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard/assets/edit/assets/${asset.id}`);
    };

    return (
        <div className="space-y-6">
            <Card className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">
                        Edit Asset
                    </h2>
                    <Link href={`/dashboard/assets/${asset.asset_type_id}`}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                <Separator />

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Asset Type */}
                    <div>
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

                    {/* Serial Code */}
                    <div>
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

                    {/* Brand */}
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            type="text"
                            value={data.brand}
                            onChange={(e) => setData("brand", e.target.value)}
                        />
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <Label htmlFor="purchase_price">Purchase Price</Label>
                        <Input
                            type="number"
                            value={data.purchase_price}
                            onChange={(e) =>
                                setData("purchase_price", e.target.value)
                            }
                        />
                    </div>

                    {/* Specification */}
                    <div className="sm:col-span-2 lg:col-span-3">
                        <Label htmlFor="specification">Specification</Label>
                        <Input
                            type="text"
                            value={data.specification}
                            onChange={(e) =>
                                setData("specification", e.target.value)
                            }
                        />
                    </div>

                    {/* Purchase Date */}
                    <div>
                        <Label htmlFor="purchase_date">Purchase Date</Label>
                        <Input
                            type="date"
                            value={data.purchase_date}
                            onChange={(e) =>
                                setData("purchase_date", e.target.value)
                            }
                        />
                    </div>

                    {/* Initial Condition */}
                    <div>
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

                    {/* Current Condition */}
                    <div>
                        <Label>Current Condition</Label>
                        <Select
                            value={data.condition}
                            onValueChange={(value) =>
                                setData("condition", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="defect">Defect</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Availability */}
                    <div>
                        <Label>Availability</Label>
                        <Select
                            value={data.avaibility}
                            disabled
                            onValueChange={(value) =>
                                setData("avaibility", value)
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

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" className="cursor-pointer">
                            Update Asset
                            <Save className="w-4 h-4 mr-2" />
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

AssetsEdit.layout = (page) => <Dashboard children={page} />;

export default AssetsEdit;
