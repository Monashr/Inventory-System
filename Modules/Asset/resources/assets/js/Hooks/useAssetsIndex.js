import { useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useAssetIndex() {
    const { assets, filters, filterValues, flash } = usePage().props;

    const columns = [
        {
            key: "serial_code",
            label: "Serial Code",
            type: "text",
        },
        {
            key: "brand",
            label: "Brand",
            type: "text",
        },
        {
            key: "condition",
            label: "Condition",
            type: "badge",
            badgeColors: {
                good: "green",
                used: "yellow",
                damaged: "red",
            },
        },
        {
            key: "availability",
            label: "Availability",
            type: "badge",
            badgeColors: {
                available: "green",
                loaned: "yellow",
                missing: "red",
            },
        },
        {
            key: "created_at",
            label: "Created At",
            type: "time",
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        brand: filters.brand || "",
        condition: filters.condition || "",
        availability: filters.availability || "",
    });

    const [search, setSearch] = useState(filters.search || "");

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";
    const fileInputRef = useRef(null);

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            router.post("/dashboard/assets/import", formData, {
                forceFormData: true,
                onSuccess: () => {},
                onError: () => {},
            });
        }
    }

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/assets/`,
            {
                per_page: value,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                brand: currentFilters.brand,
                condition: currentFilters.condition,
                availability: currentFilters.availability,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const onRowClick = (item) => {
        router.visit(`/dashboard/assets/${item.id}/details`);
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/assets",
            {
                per_page: assets.per_page,
                search,
                sort_by: column,
                sort_direction: direction,
                brand: currentFilters.brand,
                condition: currentFilters.condition,
                availability: currentFilters.availability,
            },
            { preserveScroll: true }
        );
    };

    const onSearch = () => {
        router.get(
            "/dashboard/assets",
            {
                per_page: assets.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                brand: currentFilters.brand,
                condition: currentFilters.condition,
                availability: currentFilters.availability,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = () => {
        router.get(
            "/dashboard/assets",
            {
                per_page: assets.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                brand: currentFilters.brand,
                condition: currentFilters.condition,
                availability: currentFilters.availability,
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
        assets,
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
        fileInputRef,
        handleSort,
        onSearch,
        handleFileChange,
    };
}
