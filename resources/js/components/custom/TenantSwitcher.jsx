import React from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@components/ui/select";

import { router } from "@inertiajs/react";

export default function TenantSwitcher({
    tenants,
    currentTenantId,
}) {
    function handleChange(tenantId) {
        router.post(`/switch/${tenantId}`, {
            preserveScroll: true,
            onSuccess: () => {
                
            },
            onError: (err) => {
                
            },
        });
    }

    return (
        <Select
            defaultValue={String(currentTenantId)}
            onValueChange={handleChange}
        >
            <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
                {tenants.map((tenant) => (
                    <SelectItem className="cursor-pointer" key={tenant.id} value={String(tenant.id)}>
                        {tenant.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
