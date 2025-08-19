import { useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useLoansIndex() {
    // const { employees, authUser, permissions, filters, filterValues, flash } =
    //     usePage().props;

    const { loans, permissions, filters, filterValues, flash } = usePage().props;

    const columns = [
        {
            key: "user_name",
            label: "Name",
            type: "text",
        },
        {
            key: "status",
            label: "Status",
            type: "badge",
            badgeColors: {
                accepted: "green",
                pending: "yellow",
                cancelled: "red",
                rejected: "red",
            },
        },
        {
            key: "description",
            label: "Description",
            type: "text",
        },
        {
            key: "created_at",
            label: "Created At",
            type: "time",
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        name: filters.name || "",
        status: filters.status || "",
        description: filters.description || "",
        created_at: filters.created_at || "",
    });

    const [search, setSearch] = useState(filters.search || "");

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/loans/`,
            {
                per_page: value,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                name: currentFilters.name,
                status: currentFilters.status,
                description: currentFilters.description,
                created_at: currentFilters.created_at,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const onRowClick = (item) => {
        router.visit(`/dashboard/loans/${item.id}`);
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/loans",
            {
                per_page: loans.per_page,
                search,
                sort_by: column,
                sort_direction: direction,
                name: currentFilters.name,
                status: currentFilters.status,
                description: currentFilters.description,
                created_at: currentFilters.created_at,
            },
            { preserveScroll: true }
        );
    };

    const onSearch = () => {
        router.get(
            "/dashboard/loans",
            {
                per_page: loans.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                name: currentFilters.name,
                status: currentFilters.status,
                description: currentFilters.description,
                created_at: currentFilters.created_at,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = () => {
        router.get(
            "/dashboard/loans",
            {
                per_page: loans.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                name: currentFilters.name,
                status: currentFilters.status,
                description: currentFilters.description,
                created_at: currentFilters.created_at,
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
        loans,
        columns,
        permissions,
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
