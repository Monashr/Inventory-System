import React from "react";

import { router } from "@inertiajs/react";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";


export default function TenantSwitcher({ tenants, currentTenantId }) {
    function handleChange(tenantId) {
        router.post(`/switch/${tenantId}`, {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (err) => {},
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
                    <SelectItem
                        className="cursor-pointer"
                        key={tenant.id}
                        value={String(tenant.id)}
                    >
                        <Avatar className="rounded-lg h-6 w-6">
                            <AvatarImage src={`/storage/${tenant.pictures}`} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {tenant.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
