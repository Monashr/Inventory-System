import React from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import Dashboard from "@components/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Hammer, Save } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function RepairAdd() {
    const { assetTypes } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        asset_id: "",
        repair_start_date: "",
        repair_completion_date: null,
        defect_description: "",
        corrective_action: "",
        repair_cost: "",
        vendor: "",
        status: null,
    });

    const [assets, setAssets] = React.useState([]);

    const handleAssetTypeChange = async (value) => {
        setData("asset_type_id", value);
        setData("asset_id", "");

        try {
            const res = await fetch(`/dashboard/assets/api/${value}/assets`);
            const json = await res.json();
            setAssets(json);
        } catch (error) {
            setAssets([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/repairs/add", {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-6 py-2">
                <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                    <Hammer className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                    Add Repair
                </h1>
                <Link href="/dashboard/repairs">
                    <Button className="cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>
                </Link>
            </div>

            <Card className="px-6 py-8 space-y-2">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    {/* Asset Type */}
                    <div className="space-y-2">
                        <Label htmlFor="asset_type_id">Asset Type</Label>
                        <Select onValueChange={handleAssetTypeChange}>
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

                    {/* Asset */}
                    <div className="space-y-2">
                        <Label htmlFor="asset_id">Asset</Label>
                        <Select
                            value={data.asset_id ?? ""}
                            onValueChange={(value) =>
                                setData("asset_id", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent>
                                {assets.map((asset) => (
                                    <SelectItem
                                        key={asset.id}
                                        value={String(asset.id)}
                                    >
                                        {asset.serial_code ||
                                            `Asset ${asset.id}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.asset_id && (
                            <p className="text-sm text-red-500">
                                {errors.asset_id}
                            </p>
                        )}
                    </div>

                    {/* Repair Start Date */}
                    <div className="space-y-2">
                        <Label htmlFor="repair_start_date">
                            Repair Start Date
                        </Label>
                        <Input
                            type="date"
                            id="repair_start_date"
                            value={data.repair_start_date}
                            onChange={(e) =>
                                setData("repair_start_date", e.target.value)
                            }
                        />
                        {errors.repair_start_date && (
                            <p className="text-sm text-red-500">
                                {errors.repair_start_date}
                            </p>
                        )}
                    </div>

                    {/* Vendor */}
                    <div className="space-y-2">
                        <Label htmlFor="vendor">Vendor</Label>
                        <Input
                            type="text"
                            id="vendor"
                            value={data.vendor}
                            onChange={(e) => setData("vendor", e.target.value)}
                        />
                        {errors.vendor && (
                            <p className="text-sm text-red-500">
                                {errors.vendor}
                            </p>
                        )}
                    </div>

                    {/* Defect Description */}
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="defect_description">
                            Defect Description
                        </Label>
                        <Textarea
                            id="defect_description"
                            value={data.defect_description}
                            onChange={(e) =>
                                setData("defect_description", e.target.value)
                            }
                        />
                        {errors.defect_description && (
                            <p className="text-sm text-red-500">
                                {errors.defect_description}
                            </p>
                        )}
                    </div>

                    {/* Corrective Action */}
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="corrective_action">
                            Corrective Action
                        </Label>
                        <Textarea
                            id="corrective_action"
                            value={data.corrective_action}
                            onChange={(e) =>
                                setData("corrective_action", e.target.value)
                            }
                        />
                        {errors.corrective_action && (
                            <p className="text-sm text-red-500">
                                {errors.corrective_action}
                            </p>
                        )}
                    </div>

                    {/* Repair Cost */}
                    <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="repair_cost">Repair Cost</Label>
                        <Input
                            type="number"
                            step="0.01"
                            id="repair_cost"
                            value={data.repair_cost}
                            onChange={(e) =>
                                setData("repair_cost", e.target.value)
                            }
                        />
                        {errors.repair_cost && (
                            <p className="text-sm text-red-500">
                                {errors.repair_cost}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 flex justify-end items-center pt-2">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={processing}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Repair
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

RepairAdd.layout = (page) => <Dashboard children={page} />;

export default RepairAdd;
