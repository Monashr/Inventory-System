<?php

namespace App\helper;

use Spatie\Multitenancy\Models\Tenant;
use Spatie\Multitenancy\TenantFinder\TenantFinder;

class SessionTenantFinder extends TenantFinder
{
    public function findForRequest($request): ?Tenant
    {
        $tenantId = session('active_tenant_id');

        if (!$tenantId) {
            return null;
        }

        return Tenant::find($tenantId);
    }
}
