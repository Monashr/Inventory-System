import React from "react";

import { useForm, Link, usePage, Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { ChevronLeft, Plus, Hammer, Save } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";
import { SearchSelect } from "@components/custom/SearchSelectInput";

function RepairAdd() {
    const { assetTypes, vendors } = usePage().props;

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
        <>
            <Head title="Add Repair" />
            <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                            <Hammer className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                            Add Repair
                        </h1>
                        <Link href="/dashboard/repairs">
                            <Button className="cursor-pointer w-full h-full">
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card className="px-6 py-8 space-y-2">
                    {!assetTypes || assetTypes.length === 0 ? (
                        <div className="space-y-4 flex flex-col justify-center items-center">
                            <p className="text-lg font-medium text-gray-700">
                                You need to add at least one asset type before
                                creating repairs.
                            </p>
                            <Link href="/dashboard/assettypes/add">
                                <Button
                                    variant="default"
                                    className="mx-auto cursor-pointer"
                                >
                                    <Plus />
                                    Add Asset Type
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="asset_type_id">
                                    Asset Type
                                </Label>

                                <SearchSelect
                                    options={assetTypes}
                                    value={data.asset_type_id}
                                    onChange={(val) =>
                                        handleAssetTypeChange(val)
                                    }
                                    getOptionLabel={(type) => type.name}
                                    getOptionValue={(type) => String(type.id)}
                                    placeholder="Select Asset Type"
                                />
                                {errors.asset_type_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.asset_type_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="asset_id">Asset</Label>
                                <SearchSelect
                                    options={assets}
                                    value={data.asset_id}
                                    onChange={(val) => setData("asset_id", val)}
                                    getOptionLabel={(asset) =>
                                        asset.serial_code || `Asset ${asset.id}`
                                    }
                                    getOptionValue={(asset) => String(asset.id)}
                                    placeholder="Select Asset"
                                />

                                {errors.asset_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.asset_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendor">Vendor</Label>

                                <ComboBoxInput
                                    id="vendor"
                                    options={vendors.map(
                                        (vendor) => vendor.name
                                    )}
                                    value={data.vendor}
                                    onChange={(value) => {
                                        setData("vendor", value);

                                        const selected = vendors.find(
                                            (v) => v.name === value
                                        );
                                        if (selected) {
                                            setData(
                                                "vendor_address",
                                                selected.address || ""
                                            );
                                        }
                                    }}
                                    placeholder="Enter Vendor"
                                />

                                {errors.vendor && (
                                    <p className="text-sm text-red-500">
                                        {errors.vendor}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="repair_start_date">
                                    Repair Start Date
                                </Label>
                                <Input
                                    type="date"
                                    id="repair_start_date"
                                    className="cursor-pointer"
                                    value={data.repair_start_date}
                                    onChange={(e) =>
                                        setData(
                                            "repair_start_date",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.repair_start_date && (
                                    <p className="text-sm text-red-500">
                                        {errors.repair_start_date}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="vendor_address">
                                    Vendor Address
                                </Label>
                                <Textarea
                                    id="vendor_address"
                                    value={data.vendor_address}
                                    onChange={(e) =>
                                        setData(
                                            "vendor_address",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.vendor_address && (
                                    <p className="text-sm text-red-500">
                                        {errors.vendor_address}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="defect_description">
                                    Defect Description
                                </Label>
                                <Textarea
                                    id="defect_description"
                                    value={data.defect_description}
                                    onChange={(e) =>
                                        setData(
                                            "defect_description",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.defect_description && (
                                    <p className="text-sm text-red-500">
                                        {errors.defect_description}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="corrective_action">
                                    Corrective Action
                                </Label>
                                <Textarea
                                    id="corrective_action"
                                    value={data.corrective_action}
                                    onChange={(e) =>
                                        setData(
                                            "corrective_action",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.corrective_action && (
                                    <p className="text-sm text-red-500">
                                        {errors.corrective_action}
                                    </p>
                                )}
                            </div>

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

                            <div className="sm:col-span-2 flex justify-end items-center">
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
                    )}
                </Card>
            </div>
        </>
    );
}

RepairAdd.layout = (page) => <Dashboard children={page} />;

export default RepairAdd;
