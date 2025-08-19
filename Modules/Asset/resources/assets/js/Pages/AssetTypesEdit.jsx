import React from "react";

import { Head, Link, useForm, usePage } from "@inertiajs/react";

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
        <>
            <Head title="Asset Type Edit" />
            <div className="w-full space-y-4">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                            <Package className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                            Edit Asset Type
                        </h1>
                        <div className="grid grid-cols-1 gap-2 sm:flex">
                            <Link
                                href={`/dashboard/assettypes/${assetType.id}/details`}
                            >
                                <Button className="cursor-pointer h-full w-full">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
                <Card className="w-full mx-auto">
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </>
    );
}

AssetTypesEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default AssetTypesEdit;
