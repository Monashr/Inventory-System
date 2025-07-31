import React from "react";

import { useForm, Link, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { ChevronLeft, Hammer, Save } from "lucide-react";

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

function RepairEdit() {
    const { repair } = usePage().props;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    const { data, setData, put, processing, errors } = useForm({
        repair_start_date: repair.repair_start_date ?? "",
        repair_completion_date: repair.repair_completion_date ?? "",
        defect_description: repair.defect_description ?? "",
        corrective_action: repair.corrective_action ?? "",
        repair_cost: repair.repair_cost ?? "",
        vendor: repair.vendor ?? "",
        status: repair.status ?? "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard/repairs/${repair.id}/update`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-6 py-2">
                <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                    <Hammer className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                    Edit Repair
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
                    <div className="space-y-2">
                        <Label>Asset Serial</Label>
                        <Input
                            value={repair.asset.serial_code || "-"}
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="repair_start_date">
                            Repair Start Date
                        </Label>
                        <Input
                            type="date"
                            id="repair_start_date"
                            value={formatDate(data.repair_start_date)}
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

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status ?? ""}
                            onValueChange={(value) => setData("status", value)}
                            disabled
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="canceled">
                                    Canceled
                                </SelectItem>
                                <SelectItem value="progress">
                                    Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-red-500">
                                {errors.status}
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
                                setData("defect_description", e.target.value)
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
                                setData("corrective_action", e.target.value)
                            }
                        />
                        {errors.corrective_action && (
                            <p className="text-sm text-red-500">
                                {errors.corrective_action}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
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

                    <div className="flex items-center justify-end pt-2">
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={processing}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Update Repair
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

RepairEdit.layout = (page) => <Dashboard children={page} />;

export default RepairEdit;
