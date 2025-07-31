import React from "react";

import { useForm, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import { ComboBoxInput } from "@components/custom/ComboBoxInput";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function AssetTypesAdd() {

    const { models } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        model: "",
        asset: "",
    });

    console.log(data);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/assettypes/add", {
            onSuccess: () => {
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
                            <Label htmlFor="name">Name</Label>
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
                            <Label htmlFor="model">Model</Label>
                            <ComboBoxInput
                                id="model"
                                options={models}
                                value={data.model}
                                onChange={(value) => setData("model", value)}
                                placeholder=""
                            />
                            {errors.model && (
                                <p className="text-sm text-red-500">
                                    {errors.model}
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

AssetTypesAdd.layout = (page) => <Dashboard children={page} />;

export default AssetTypesAdd;