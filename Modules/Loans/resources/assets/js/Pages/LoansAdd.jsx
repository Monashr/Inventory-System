import React, { useState, useMemo } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import Dashboard from "@components/layout/Dashboard";
import {
    Package,
    PackageOpen,
    Plus,
    ShoppingCart,
    Trash2,
    ChevronLeft,
    Search,
    User,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Filter,
    Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CustomPagination from "@components/custom/CustomPagination";

function LoansAdd() {
    const { assets, users } = usePage().props;
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [conditionFilter, setConditionFilter] = useState("all");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/loans/add`,
            {
                per_page: value,
                search,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleAddToCart = (asset) => {
        if (!cart.find((item) => item.id === asset.id)) {
            setCart([
                ...cart,
                { ...asset, date: new Date().toISOString().split("T")[0] },
            ]);
            toast.success(`${asset.brand} added to loan list`);
        }
    };

    const handleRemoveFromCart = (id) => {
        const asset = cart.find((item) => item.id === id);
        setCart(cart.filter((item) => item.id !== id));
        if (asset) {
            toast.success(`${asset.brand} removed from loan list`);
        }
    };

    const handleDateChange = (id, date) => {
        setCart(
            cart.map((item) => (item.id === id ? { ...item, date } : item))
        );
    };

    const filteredAssets = useMemo(() => {
        let filtered =
            assets?.data?.filter(
                (asset) =>
                    asset.brand.toLowerCase().includes(search.toLowerCase()) ||
                    asset.serial_code
                        .toLowerCase()
                        .includes(search.toLowerCase())
            ) || [];

        if (conditionFilter !== "all") {
            filtered = filtered.filter(
                (asset) => asset.condition === conditionFilter
            );
        }

        return filtered;
    }, [assets, search, conditionFilter]);

    const getConditionConfig = (condition) => {
        const configs = {
            good: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200",
            used: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
            defect: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200",
        };
        return (
            configs[condition] || "bg-gray-100 text-gray-800 border-gray-200"
        );
    };

    const canSubmit =
        selectedUser && cart.length > 0 && cart.every((item) => item.date);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) {
            toast.error("Please complete all required fields");
            return;
        }

        setIsSubmitting(true);

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
                    setIsSubmitting(false);
                    toast.success("Loan created successfully!");
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    toast.error("Failed to create loan. Please try again.");
                },
            }
        );
    };

    return (
        <>
            <Head title="Add Loan" />
            <div className="flex flex-col h-full space-y-6">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                            <PackageOpen className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                            Add Loans
                        </h1>
                        <Link href="/dashboard/loans">
                            <Button className="cursor-pointer h-full w-full">
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </Card>

                <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
                    <Card className="lg:col-span-2 flex flex-col min-h-0">
                        <CardHeader className="pb-4 shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Package className="w-5 h-5" />
                                    Available Assets
                                </CardTitle>

                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            type="text"
                                            placeholder="Search assets..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="pl-10 w-full sm:w-64"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-0">
                            <ScrollArea className="h-full px-6 pb-6">
                                {filteredAssets.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-2">
                                        {filteredAssets.map((asset) => {
                                            const isInCart = cart.some(
                                                (item) => item.id === asset.id
                                            );
                                            return (
                                                <Card
                                                    key={asset.id}
                                                    className={`transition-all duration-200 hover:shadow-md ${
                                                        isInCart
                                                            ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950"
                                                            : "hover:shadow-lg"
                                                    }`}
                                                >
                                                    <CardContent className="p-4 space-y-3">
                                                        <div className="space-y-1">
                                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                                                                {asset.brand}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                                {
                                                                    asset.serial_code
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">
                                                                Condition:
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${getConditionConfig(
                                                                    asset.condition
                                                                )}`}
                                                            >
                                                                {asset.condition
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    asset.condition.slice(
                                                                        1
                                                                    )}
                                                            </Badge>
                                                        </div>

                                                        {isInCart ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full bg-green-100 text-green-800 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                                                                disabled
                                                            >
                                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                                Added
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                className="w-full cursor-pointer"
                                                                onClick={() =>
                                                                    handleAddToCart(
                                                                        asset
                                                                    )
                                                                }
                                                            >
                                                                <Plus className="w-4 h-4 mr-1" />
                                                                Add to Loan
                                                            </Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                        <Package className="w-16 h-16 text-gray-300" />
                                        <div className="text-center space-y-2">
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                No Assets Found
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Try adjusting your search or
                                                filters
                                            </p>
                                        </div>
                                        <Link href="/dashboard/assets/add">
                                            <Button>
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add New Asset
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                        <div className="px-6">
                            <CustomPagination
                                data={assets}
                                onPaginationChange={onPaginationChange}
                            />
                        </div>
                    </Card>

                    <Card className="flex flex-col min-h-0">
                        <CardHeader className="pb-4 shrink-0">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingCart className="w-5 h-5" />
                                Loan ({cart.length}{" "}
                                {cart.length === 1 ? "asset" : "assets"})
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col space-y-6 min-h-0">
                            <div className="space-y-2 shrink-0">
                                <Label className="text-sm font-medium flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    Employee
                                </Label>
                                <Select
                                    value={selectedUser || ""}
                                    onValueChange={setSelectedUser}
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Choose an employee" />
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

                            <Separator className="shrink-0" />

                            <div className="flex-1 space-y-2 min-h-0">
                                <Label className="text-sm font-medium flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Assets & Loan Dates
                                </Label>

                                <div className="flex-1 border rounded-lg min-h-0">
                                    <ScrollArea className="h-full p-2">
                                        {cart.length > 0 ? (
                                            <div className="space-y-3 p-2">
                                                {cart.map((item) => (
                                                    <Card
                                                        key={item.id}
                                                        className="p-2"
                                                    >
                                                        <CardContent className="p-3 space-y-3">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                                                        {
                                                                            item.brand
                                                                        }
                                                                    </h4>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                                                        {
                                                                            item.serial_code
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleRemoveFromCart(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 p-1 cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <Label className="text-xs text-gray-500">
                                                                    Loan Date
                                                                </Label>
                                                                <Input
                                                                    type="date"
                                                                    value={
                                                                        item.date
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleDateChange(
                                                                            item.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="text-sm cursor-pointer"
                                                                    min={
                                                                        new Date()
                                                                            .toISOString()
                                                                            .split(
                                                                                "T"
                                                                            )[0]
                                                                    }
                                                                />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-32 text-center space-y-2">
                                                <ShoppingCart className="w-8 h-8 text-gray-300" />
                                                <p className="text-sm text-gray-500">
                                                    No assets selected
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Add assets from the left
                                                    panel
                                                </p>
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </div>

                            {cart.length > 0 && (
                                <div className="space-y-2 shrink-0">
                                    {!selectedUser && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription className="text-sm">
                                                Please select employee
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {cart.some((item) => !item.date) && (
                                        <Alert>
                                            <Clock className="h-4 w-4" />
                                            <AlertDescription className="text-sm">
                                                Please set loan dates for all
                                                assets
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 border-t shrink-0">
                                <Button
                                    className="w-full cursor-pointer"
                                    disabled={!canSubmit || isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Creating Loan...
                                        </>
                                    ) : (
                                        <>Create Loan</>
                                    )}
                                </Button>

                                {cart.length > 0 && (
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Review all details before creating the
                                        loan
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

LoansAdd.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansAdd;
