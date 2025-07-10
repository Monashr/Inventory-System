import React from "react";

import { Link } from "@inertiajs/react";

import { ChevronRight } from "lucide-react";

import Dashboard from "@components/layout/Dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";

import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";

function ItemsAdd() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        stock: "",
        price: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/items/add", {
            onError: () => {},
        });
    };

    return (
        <div className="w-full">
            <DynamicBreadcrumbs />
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between w-full">
                        Add New Item
                        <Link href="/dashboard/items">
                            <Button
                                data-modal-trigger="add-product"
                                className=" cursor-pointer"
                            >
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
                            Save Item
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

ItemsAdd.layout = (page) => <Dashboard>{page}</Dashboard>;

export default ItemsAdd;
