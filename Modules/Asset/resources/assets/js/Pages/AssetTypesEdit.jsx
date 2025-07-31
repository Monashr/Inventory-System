import React from "react";

import { Link, useForm, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { ChevronLeft, Package, SaveAll } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function AssetTypesEdit() {
    const { assetType } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: assetType.name || "",
        model: assetType.model || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard/assettypes/${assetType.id}/edit`, {
            onError: () => {},
        });
    };

    return (
        <div className="w-full">
            <Card className="w-full mx-auto">
                <CardContent className="space-y-2 pb-12">
                    <CardTitle className="flex items-center justify-between w-full px-6 py-6">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Edit Asset Type
                        </h1>
                        <Link href={`/dashboard/assettypes/${assetType.id}/details`}>
                            <Button className="cursor-pointer">
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                    </CardTitle>
                    <form onSubmit={handleSubmit} className="px-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Enter Asset Type name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={data.model}
                                onChange={(e) =>
                                    setData("model", e.target.value)
                                }
                                placeholder="Enter Asset Type Model"
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

                            Update Item
                            <SaveAll />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

AssetTypesEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default AssetTypesEdit;
