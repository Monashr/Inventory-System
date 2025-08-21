import React from "react";

import { formatDateNoHour, formatDate } from "@components/lib/utils";

function AssetDetailsTable({ asset }) {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
            <Detail label="Specification" value={asset.specification} />

            <Detail label="Brand" value={asset.brand} />

            <Detail
                label="Purchase Price"
                value={asset.purchase_price ? `Rp${asset.purchase_price}` : "-"}
            />

            <DetailBadgeAvailability
                label="Availability"
                value={asset.availability}
            />

            <DetailBadgeCondition
                label="Current Condition"
                value={asset.condition}
            />

            <DetailBadgeCondition
                label="Initial Condition"
                value={asset.initial_condition}
            />

            <Detail label="Created At" value={formatDate(asset.created_at)} />

            <Detail label="Last Updated" value={formatDate(asset.updated_at)} />

            <Detail
                label="Purchase Date"
                value={formatDateNoHour(asset.purchase_date)}
            />
            
            <Detail label="Location" value={asset.location.address} />
        </div>
    );
}

const Detail = ({ label, value }) => (
    <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold text-foreground">
            {value ?? "-"}
        </p>
    </div>
);

const DetailBadgeAvailability = ({ label, value }) => (
    <div className="space-y-2">
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
    <div className="space-y-2">
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

export default AssetDetailsTable;
