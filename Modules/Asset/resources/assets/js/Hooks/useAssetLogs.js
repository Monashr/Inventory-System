import { useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useAssetLogs() {
    const { asset, log, filters, filterValues, flash } = usePage().props;

    const columns = [
        {
            key: "activity_date",
            label: "Activity Date",
            type: "time",
        },
        {
            key: "user",
            label: "User",
            type: "text",
        },
        {
            key: "activity_type",
            label: "Activity Type",
            type: "text",
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        user: filters.user || "",
        activity_type: filters.activity_type || "",
    });

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/assets/${asset.id}/details`,
            {
                per_page: value,
                sort_by: sortBy,
                sort_direction: sortDirection,
                user: currentFilters.user,
                activity_type: currentFilters.activity_type,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            `/dashboard/assets/${asset.id}/details`,
            {
                per_page: log.per_page,
                sort_by: column,
                sort_direction: direction,
                user: currentFilters.user,
                activity_type: currentFilters.activity_type,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = (currentFilters) => {
        router.get(
            `/dashboard/assets/${asset.id}/details`,
            {
                per_page: log.per_page,
                sort_by: sortBy,
                sort_direction: sortDirection,
                user: currentFilters.user,
                activity_type: currentFilters.activity_type,
            },
            { preserveScroll: true }
        );
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return {
        asset,
        log,
        columns,
        currentFilters,
        setCurrentFilters,
        filters,
        sortBy,
        sortDirection,
        filterValues,
        applyFilters,
        onPaginationChange,
        handleSort,
    };
}
