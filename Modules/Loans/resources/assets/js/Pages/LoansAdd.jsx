import React, { useState } from "react";

import { Link, usePage, router } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import {
    Package,
    PackageOpen,
    Plus,
    ShoppingCart,
    TrashIcon,
    ChevronLeft,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

function Concept() {
    const { assets, users } = usePage().props;

    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [cart, setCart] = useState([]);

    const handleAddToCart = (asset) => {
        if (!cart.find((item) => item.id === asset.id)) {
            setCart([...cart, { ...asset, date: "" }]);
        }
    };

    const handleRemoveFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const handleDateChange = (id, date) => {
        setCart(
            cart.map((item) => (item.id === id ? { ...item, date } : item))
        );
    };

    const filteredAssets = assets?.data?.filter(
        (asset) =>
            asset.brand.toLowerCase().includes(search.toLowerCase()) ||
            asset.serial_code.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedAssets = cart.map((item) => ({
            asset_id: item.id,
            asset_type_id: item.asset_type_id,
            loaned_date: item.date,
        }));

        router.post(
            "/dashboard/loans",
            {
                loaner: selectedUser,
                description: "No Description",
                assets: formattedAssets,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCart([]);
                    setSelectedUser(null);
                },
                onError: (e) => {
                    
                },
            }
        );
    };

    return (
        <div className="w-full mx-auto px-4">
            <div className="space-y-4">
                <div className="px-2 py-2 flex justify-between items-center gap-2">
                    <h1 className="flex items-center font-bold text-lg md:text-2xl">
                        <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                        Loans
                    </h1>
                    <Link href="/dashboard/loans">
                        <Button
                            data-modal-trigger="add-product"
                            className="cursor-pointer h-full"
                        >
                            <ChevronLeft />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="flex w-full h-[70vh] gap-4 overflow-hidden">
                    <Card className="w-2/3 flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span className="text-lg flex justify-center items-center gap-2">
                                    <Package />
                                    Assets
                                </span>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Search"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto">
                            <ScrollArea className="h-full pr-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {filteredAssets?.length > 0 ? (
                                        filteredAssets.map((asset) => (
                                            <Card
                                                key={asset.id}
                                                className="bg-accent"
                                            >
                                                <CardContent className="space-y-4 py-4 px-2">
                                                    <div className="space-y-1">
                                                        <h3 className="font-bold text-md">
                                                            {asset.brand}
                                                        </h3>
                                                        <p className="text-sm">
                                                            {asset.serial_code}
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Condition:</span>
                                                        <span>
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                                    asset.condition ===
                                                                    "good"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : asset.condition ===
                                                                          "used"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }`}
                                                            >
                                                                {asset.condition
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    asset.condition.slice(
                                                                        1
                                                                    )}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {cart.some(
                                                        (item) =>
                                                            item.id === asset.id
                                                    ) ? (
                                                        <Button
                                                            className="w-full bg-green-200 text-green-800 cursor-default hover:bg-green-200"
                                                            disabled
                                                        >
                                                            Added
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className="w-full cursor-pointer"
                                                            onClick={() =>
                                                                handleAddToCart(
                                                                    asset
                                                                )
                                                            }
                                                        >
                                                            Add
                                                        </Button>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="space-y-4 flex flex-col justify-center items-center">
                                            <p className="text-lg font-medium text-gray-700">
                                                No Assets Found
                                            </p>
                                            <Link href="/dashboard/assets/add">
                                                <Button
                                                    variant="default"
                                                    className="mx-auto cursor-pointer"
                                                >
                                                    <Plus />
                                                    Add Assets
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card className="w-1/3 flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                <span className="text-lg flex justify-start items-center gap-2">
                                    <ShoppingCart />
                                    Loan Lists
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 justify-between mt-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Select Employee
                                    </label>
                                    <Select
                                        onValueChange={(value) =>
                                            setSelectedUser(value)
                                        }
                                    >
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder="Choose employee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users?.map((user) => (
                                                <SelectItem
                                                    className="cursor-pointer"
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-2 overflow-y-auto max-h-60 border rounded-2xl p-2">
                                    {cart.length > 0 ? (
                                        cart.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-col space-y-2 bg-accent px-4 py-4 rounded-2xl"
                                            >
                                                <div className="flex justify-between items-center text-sm pl-2">
                                                    <div>
                                                        {item.brand} -{" "}
                                                        {item.serial_code}
                                                    </div>
                                                    <Button
                                                        className="cursor-pointer"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveFromCart(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <TrashIcon />
                                                    </Button>
                                                </div>
                                                <Input
                                                    type="date"
                                                    value={item.date}
                                                    onChange={(e) =>
                                                        handleDateChange(
                                                            item.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="text-sm bg-white cursor-pointer"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No assets in cart.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    className="w-full cursor-pointer"
                                    disabled={
                                        !selectedUser ||
                                        cart.length === 0 ||
                                        cart.some((item) => !item.date)
                                    }
                                    onClick={handleSubmit}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

Concept.layout = (page) => <Dashboard>{page}</Dashboard>;

export default Concept;
