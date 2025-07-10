<?php

use App\Models\Tenant;

if (!function_exists('tenant')) {
    function tenant(): ?Tenant
    {
        return Tenant::current();
    }
}
