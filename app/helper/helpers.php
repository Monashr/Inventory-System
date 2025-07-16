<?php

use App\Models\Tenant;

if (!function_exists('tenant')) {
    function tenant(): ?Tenant
    {
        return Tenant::current();
    }
}

if (!function_exists('checkAuthority')) {
    function checkAuthority(string $permission): bool
    {
        $user = auth()->user();

        if (!$user) {
            return false;
        }
        
        if (in_array($permission, auth()->user()->getTenantPermission())) {
            return true;
        }

        return false;
    }
}