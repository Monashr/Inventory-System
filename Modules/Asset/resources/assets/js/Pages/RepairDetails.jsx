import React from "react";

import { Link, usePage, useForm, Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import {
    Ban,
    Hammer,
    Pen,
    Check,
    ChevronLeft,
    Trash,
    FileWarning,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function RepairDetails() {
    const { repair } = usePage().props;

    const { post } = useForm();

    const markComplete = () => {
        post(`/dashboard/repairs/${repair.id}/complete`);
    };

    const cancelRepair = () => {
        post(`/dashboard/repairs/${repair.id}/cancel`);
    };

    return (
        <>
            <Head title={repair.asset.serial_code || "Repair"} />
            <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                            <Hammer className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                            Repair Details
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2">
                            <Link href={`/dashboard/repairs/${repair.id}/edit`}>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer w-full h-full"
                                >
                                    <Pen className="w-4 h-4" />
                                    Edit
                                </Button>
                            </Link>
                            <Link href="/dashboard/repairs">
                                <Button className="cursor-pointer w-full h-full">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                <Card className="px-2 py-8 space-y-2">
                    <div className="px-4 w-full">
                        {repair.asset?.deleted_at && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex gap-2 justify-center items-center">
                                <FileWarning className="w-4 h-4" /> This asset
                                is deleted <Trash className="w-4 h-4" />
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        <div className="space-y-2">
                            <Label>Asset Serial</Label>
                            <Input
                                value={repair.asset.serial_code || "-"}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Repair Start Date</Label>
                            <Input
                                value={repair.repair_start_date || "-"}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Repair Completion Date</Label>
                            <Input
                                value={repair.repair_completion_date || "-"}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Vendor</Label>
                            <Input value={repair.vendor || "-"} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label>Repair Cost</Label>
                            <Input
                                value={`$${repair.repair_cost || "0.00"}`}
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Input value={repair.status || "-"} disabled />
                        </div>

                        <div className="sm:col-span-3 space-y-2">
                            <Label>Defect Description</Label>
                            <Textarea
                                value={repair.defect_description || "-"}
                                disabled
                            />
                        </div>

                        <div className="sm:col-span-3 space-y-2">
                            <Label>Corrective Action</Label>
                            <Textarea
                                value={repair.corrective_action || "-"}
                                disabled
                            />
                        </div>
                        <div className="col-span-3 flex items-center justify-end gap-2">
                            {repair.status === "progress" && (
                                <>
                                    <Button
                                        onClick={cancelRepair}
                                        variant="destructive"
                                        className="cursor-pointer"
                                    >
                                        Cancel
                                        <Ban className="w-4 h-4 ml-2" />
                                    </Button>
                                    <Button
                                        onClick={markComplete}
                                        variant="outline"
                                        className="cursor-pointer"
                                    >
                                        Mark as Complete
                                        <Check className="w-4 h-4 ml-2" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}

RepairDetails.layout = (page) => <Dashboard children={page} />;

export default RepairDetails;
