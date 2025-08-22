import { useEffect, useRef, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { toast } from "sonner";

export default function useInboxIndex() {
    const {user, inbox, filters, filterValues, flash} = usePage().props;

    const columns = [
        {
            key: "sender_name",
            label: "Sender",
            type: "text",
            sort: true,
        },
        {
            key: "receiver_name",
            label: "Receiver",
            type: "text",
            sort: true,
        },
        {
            key: "tenant_name",
            label: "Tenant",
            type: "text",
            sort: true,
        },
        {
            key: "status",
            label: "Status",
            type: "badge",
            badgeColors: {
                pending: "yellow",
                accepted: "green",
                rejected: "red",
            },
            sort: true,
        },
        {
            key: "created_at",
            label: "Sent At",
            type: "time",
            sort: true,
        },
    ];

    const [currentFilters, setCurrentFilters] = useState({
        tenant: filters.tenant || "",
    });

    const [search, setSearch] = useState(filters.search || "");

    const sortBy = filters.sort_by || "";
    const sortDirection = filters.sort_direction || "";

    const onPaginationChange = (value) => {
        router.get(
            `/dashboard/inbox/`,
            {
                per_page: value,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                tenant: currentFilters.tenant,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const onRowClick = (item) => {
        router.visit(`/dashboard/inbox/detail/${item.id}`);
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (sortBy === column && sortDirection === "asc") {
            direction = "desc";
        }

        router.get(
            "/dashboard/inbox",
            {
                per_page: inbox.per_page,
                search,
                sort_by: column,
                sort_direction: direction,
                tenant: currentFilters.tenant,
            },
            { preserveScroll: true }
        );
    };

    const onSearch = () => {
        router.get(
            "/dashboard/inbox",
            {
                per_page: inbox.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                tenant: currentFilters.tenant,
            },
            { preserveScroll: true }
        );
    };

    const applyFilters = () => {
        router.get(
            "/dashboard/inbox",
            {
                per_page: inbox.per_page,
                search,
                sort_by: sortBy,
                sort_direction: sortDirection,
                tenant: currentFilters.tenant,
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
        user,
        inbox,
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
