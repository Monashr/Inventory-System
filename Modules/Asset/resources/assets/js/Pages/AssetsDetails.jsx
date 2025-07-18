import React from "react";

import { usePage, Link } from "@inertiajs/react";
import Dashboard from "@components/layout/Dashboard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ChevronRight } from "lucide-react";

function AssetDetail() {
    const { asset } = usePage().props;

    console.log(asset);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    const formatDateNoHour = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6 px-8 space-y-6">
                <div className="flex items-center gap-6 justify-between p-4 bg-muted/40 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24">
                            <AvatarFallback className="text-4xl font-semibold">
                                {asset.asset_type?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-3xl font-extrabold text-primary">
                                {asset.serial_code}
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                {asset.brand}
                            </p>
                        </div>
                    </div>

                    <Link href={`/dashboard/assets/${asset.asset_type_id}`}>
                        <Button className="cursor-pointer">
                            Back
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <Detail label="Specification" value={asset.specification} />
                    <Detail label="Brand" value={asset.brand} />
                    <Detail
                        label="Purchase Price"
                        value={
                            asset.purchase_price
                                ? `Rp${asset.purchase_price}`
                                : "-"
                        }
                    />
                    <DetailBadgeAvaibility
                        label="Availability"
                        value={asset.avaibility}
                    />
                    <DetailBadgeCondition
                        label="Current Condition"
                        value={asset.condition}
                    />
                    <DetailBadgeCondition
                        label="Initial Condition"
                        value={asset.initial_condition}
                    />
                    <Detail
                        label="Created At"
                        value={formatDate(asset.created_at)}
                    />
                    <Detail
                        label="Last Updated"
                        value={formatDate(asset.updated_at)}
                    />
                    <Detail
                        label="Purchase Date"
                        value={formatDateNoHour(asset.purchase_date)}
                    />
                </div>
            </Card>
        </div>
    );
}

const Detail = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground">
            {value ?? "-"}
        </p>
    </div>
);

const DetailBadgeAvaibility = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${
                    value === "available"
                        ? "bg-green-100 text-green-800"
                        : value === "loaned"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
        </p>
    </div>
);

const DetailBadgeCondition = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${
                    value === "good" || "new"
                        ? "bg-green-100 text-green-800"
                        : value === "used"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
        </p>
    </div>
);

AssetDetail.layout = (page) => <Dashboard children={page} />;

export default AssetDetail;
