import React from "react";
import { useForm } from "@inertiajs/react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AssetTypesAdd({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        model: "",
        unit: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/assets/add", {
            onSuccess: () => {
                onClose?.();
            },
            onError: () => {},
        });
    };

    return (
        <div className="w-full">
            <Card className="w-full mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Asset Type Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Enter asset name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Asset Type Model</Label>
                            <Input
                                id="model"
                                value={data.model}
                                onChange={(e) =>
                                    setData("model", e.target.value)
                                }
                                placeholder="Enter asset model"
                            />
                            {errors.model && (
                                <p className="text-sm text-red-500">
                                    {errors.model}
                                </p>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="unit">Total Unit</Label>
                            <Input
                                id="unit"
                                type="number"
                                value={data.unit}
                                onChange={(e) =>
                                    setData("unit", e.target.value)
                                }
                                placeholder="Enter asset quantity"
                            />
                            {errors.unit && (
                                <p className="text-sm text-red-500">
                                    {errors.unit}
                                </p>
                            )}
                        </div>

                        <Button
                            className="w-full cursor-pointer"
                            type="submit"
                            disabled={processing}
                        >
                            Save Asset Type
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
