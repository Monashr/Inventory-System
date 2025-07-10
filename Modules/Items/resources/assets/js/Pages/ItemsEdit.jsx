import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { ChevronRight, Package } from "lucide-react";
import Dashboard from "@components/layout/Dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";

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
            <DynamicBreadcrumbs />
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between w-full">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <Package className="mr-2" />
                            Edit Items
                        </h1>
                        <Link href="/dashboard/items">
                            <Button className="cursor-pointer">
                                Back
                                <ChevronRight />
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
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
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData("stock", e.target.value)
                                    }
                                    placeholder="Enter stock quantity"
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-500">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    placeholder="Enter item price"
                                />
                                {errors.price && (
                                    <p className="text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            type="submit"
                            disabled={processing}
                        >
                            Update Item
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

ItemsEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default ItemsEdit;
