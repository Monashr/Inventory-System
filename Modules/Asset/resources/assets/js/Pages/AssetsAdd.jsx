import React from "react";

import { useForm, Link, usePage } from "@inertiajs/react";
import Dashboard from "@components/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronRight, Save } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function AssetCreate() {
    const { assetTypes } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        asset_type_id: "",
        brand: "",
        specification: "",
        purchase_date: "",
        purchase_price: "",
        initial_condition: "new",
        condition: "good",
        avaibility: "available",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/assets/add/assets", {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="space-y-6">
            <Card className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between border-b pb-4 border-border">
                    <h1 className="text-2xl font-bold">Add New Asset</h1>
                    <Link href="/dashboard/assets">
                        <Button className="cursor-pointer">
                            Back
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {/* Asset Type */}
                    <div>
                        <Label htmlFor="asset_type_id">Asset Type</Label>
                        <Select
                            value={data.asset_type_id}
                            onValueChange={(value) => {
                                const selectedType = assetTypes.find(
                                    (type) => String(type.id) === value
                                );

                                const now = Date.now();
                                const slug = selectedType?.name
                                    ?.toLowerCase()
                                    ?.replace(/\s+/g, "-")
                                    ?.replace(/[^\w\-]+/g, "");

                                const serial = `${slug}-${now}`;

                                setData("asset_type_id", value);
                                setData("serial_code", serial);
                            }}
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

                    {/* Brand */}
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            type="text"
                            id="brand"
                            value={data.brand}
                            onChange={(e) => setData("brand", e.target.value)}
                        />
                        {errors.brand && (
                            <p className="text-sm text-red-500">
                                {errors.brand}
                            </p>
                        )}
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <Label htmlFor="purchase_price">Purchase Price</Label>
                        <Input
                            type="number"
                            step="0.01"
                            id="purchase_price"
                            value={data.purchase_price}
                            onChange={(e) =>
                                setData("purchase_price", e.target.value)
                            }
                        />
                        {errors.purchase_price && (
                            <p className="text-sm text-red-500">
                                {errors.purchase_price}
                            </p>
                        )}
                    </div>

                    {/* Specification */}
                    <div className="sm:col-span-3">
                        <Label htmlFor="specification">Specification</Label>
                        <Textarea
                            id="specification"
                            value={data.specification}
                            onChange={(e) =>
                                setData("specification", e.target.value)
                            }
                        />
                        {errors.specification && (
                            <p className="text-sm text-red-500">
                                {errors.specification}
                            </p>
                        )}
                    </div>

                    {/* Purchase Date */}
                    <div>
                        <Label htmlFor="purchase_date">Purchase Date</Label>
                        <Input
                            type="date"
                            id="purchase_date"
                            value={data.purchase_date}
                            onChange={(e) =>
                                setData("purchase_date", e.target.value)
                            }
                        />
                        {errors.purchase_date && (
                            <p className="text-sm text-red-500">
                                {errors.purchase_date}
                            </p>
                        )}
                    </div>

                    {/* Initial Condition */}
                    <div>
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
                            <SelectTrigger className="w-full">
                                <SelectValue />
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
                        <Label htmlFor="condition">Current Condition</Label>
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
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="defect">Defect</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Availability */}
                    <div>
                        <Label htmlFor="avaibility">Availability</Label>
                        <Select
                            value={data.avaibility}
                            disabled
                            onValueChange={(value) =>
                                setData("avaibility", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
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
                    <div className=" flex justify-end pt-2">
                        <Button type="submit" className="cursor-pointer" disabled={processing}>
                            Save Asset
                            <Save className="w-4 h-4 mr-2" />
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

AssetCreate.layout = (page) => <Dashboard children={page} />;

export default AssetCreate;
