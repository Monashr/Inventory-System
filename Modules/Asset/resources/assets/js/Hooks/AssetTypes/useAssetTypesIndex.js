import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useAssetTypeIndex() {
    const { assetTypes, filters, filterValues, flash } = usePage().props;

    const columns = [
        {
            key: "name",
            label: "Name",
            type: "text",
            sort: true,
        },
        {
            key: "model",
            label: "Model",
            type: "text",
            sort: true,
        },
        {
            key: "code",
            label: "Code",
            type: "text",
            sort: true,
        },
        {
            key: "created_at",
            label: "Created At",
            type: "time",
            sort: true,
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        name: filters.name || "",
        model: filters.model || "",
    });

    const [search, setSearch] = useState(filters.search || "");

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/assettypes`,
            {
                per_page: value,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                name: currentFilters.name,
                model: currentFilters.model,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const onRowClick = (item) => {
        router.visit(`/dashboard/assettypes/${item.id}/details`);
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/assettypes",
            {
                per_page: assetTypes.per_page,
                search,
                sort_by: column,
                sort_direction: direction,
                name: currentFilters.name,
                model: currentFilters.model,
            },
            { preserveScroll: true }
        );
    };

    const onSearch = () => {
        router.get(
            "/dashboard/assettypes",
            {
                per_page: assetTypes.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                name: currentFilters.name,
                model: currentFilters.model,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = () => {
        router.get(
            "/dashboard/assettypes",
            {
                per_page: assetTypes.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                name: currentFilters.name,
                model: currentFilters.model,
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
        assetTypes,
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
