import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

import { ChevronRight, Package } from "lucide-react";

import Dashboard from "@components/layout/Dashboard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function ItemsEdit() {
    const { item } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: item.name || "",
        stock: item.stock || "",
        price: item.price || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/dashboard/items/edit/${item.id}`, {
            onError: () => {},
        });
    };

    return (
        <div className="w-full">
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4">
                    <CardTitle className="flex items-center justify-between w-full px-8 py-10">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Edit Items
                        </h1>
                        <Link href={`/dashboard/items/${item.id}/unit`}>
                            <Button className="cursor-pointer">
                                Back
                                <ChevronRight />
                            </Button>
                        </Link>
                    </CardTitle>
                    <form onSubmit={handleSubmit} className="px-8 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Enter item name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-4">
                            Blank
                        </div>

                        <Button
                            className="w-full cursor-pointer"
                            type="submit"
                            disabled={processing}
                        >
                            Update Item
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

ItemsEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default ItemsEdit;
