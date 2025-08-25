import React from "react";

import { Head, Link, useForm, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { Package, ChevronLeft, Save } from "lucide-react";

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
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/assettypes/add", {
            onSuccess: () => {},
            onError: () => {},
        });
    };

    return (
        <>
            <Head title="Add Asset Type" />
            <div className="w-full space-y-4">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                            <Package className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                            Add Asset Type
                        </h1>
                        <div className="grid grid-cols-1 gap-2 sm:flex">
                            <Link href="/dashboard/assettypes">
                                <Button className="cursor-pointer h-full w-full">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
                <Card className="w-full mx-auto">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        onChange={(value) =>
                                            setData("model", value)
                                        }
                                        placeholder="Enter Model"
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
                                <Save className="w-4 h-4" /> Save Asset Type
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </>
    );
}

AssetTypesAdd.layout = (page) => <Dashboard children={page} />;

export default AssetTypesAdd;
