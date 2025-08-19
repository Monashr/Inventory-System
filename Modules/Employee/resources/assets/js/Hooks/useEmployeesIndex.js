import { useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useEmployeesIndex() {
    const { employees, authUser, permissions, filters, filterValues, flash } =
        usePage().props;

    const columns = [
        {
            key: "name",
            label: "Name",
            type: "text",
        },
        {
            key: "position",
            label: "Position",
            type: "text",
        },
        {
            key: "email",
            label: "Email",
            type: "text",
        },
        {
            key: "bio",
            label: "Bio",
            type: "text",
        },
        {
            key: "phone",
            label: "Phone",
            type: "text",
        },
        {
            key: "address",
            label: "Address",
            type: "text",
        },
        {
            key: "created_at",
            label: "Joined At",
            type: "time",
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        position: filters.position || "",
    });

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState(filters.search || "");

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/employees/`,
            {
                per_page: value,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                position: currentFilters.position,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const onRowClick = (item) => {
        router.visit(`/dashboard/employees/permission/${item.id}`);
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/employees",
            {
                per_page: employees.per_page,
                search,
                sort_by: column,
                sort_direction: direction,
                position: currentFilters.position,
            },
            { preserveScroll: true }
        );
    };

    const onSearch = () => {
        router.get(
            "/dashboard/employees",
            {
                per_page: employees.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                position: currentFilters.position,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = () => {
        router.get(
            "/dashboard/employees",
            {
                per_page: employees.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                position: currentFilters.position,
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
        employees,
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
        open,
        setOpen,
    };
}
