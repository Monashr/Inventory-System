import { useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useRepairsIndex() {
    const { repairs, filters, filterValues, flash } = usePage().props;

    const columns = [
        {
            key: "asset_name",
            label: "Asset",
            type: "text",
        },
        {
            key: "repair_start_date",
            label: "Repair Start",
            type: "time",
        },
        {
            key: "repair_completion_date",
            label: "Repair Completion",
            type: "time",
        },
        {
            key: "repair_cost",
            label: "Repair Cost",
            type: "text",
        },
        {
            key: "vendor",
            label: "Vendor",
            type: "text",
        },
        {
            key: "status",
            label: "Status",
            type: "badge",
            badgeColors: {
                completed: "green",
                progress: "yellow",
                cancelled: "red",
            },
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        status: filters.status || "",
        vendor: filters.vendor || "",
    });

    const [search, setSearch] = useState(filters.search || "");

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/repairs/`,
            {
                per_page: value,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                status: currentFilters.status,
                vendor: currentFilters.vendor,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const onRowClick = (item) => {
        router.visit(`/dashboard/repairs/${item.id}/details`);
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/repairs",
            {
                per_page: repairs.per_page,
                search,
                sort_by: column,
                sort_direction: direction,
                status: currentFilters.status,
                vendor: currentFilters.vendor,
            },
            { preserveScroll: true }
        );
    };

    const onSearch = () => {
        router.get(
            "/dashboard/repairs",
            {
                per_page: repairs.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                status: currentFilters.status,
                vendor: currentFilters.vendor,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = () => {
        router.get(
            "/dashboard/repairs",
            {
                per_page: repairs.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                status: currentFilters.status,
                vendor: currentFilters.vendor,
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
        repairs,
        columns,
        search,
        setSearch,
        currentFilters,
        setCurrentFilters,
        filters,
        sortBy,
        sortDirection,
        filterValues,
        applyFilters,
        onPaginationChange,
        onRowClick,
        handleSort,
        onSearch,
    };
}
