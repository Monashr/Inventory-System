<?php

namespace App\Http\Services;

use App\Models\Tenant;
use App\Models\User;

class TenantService
{
    public function createTenant(array $data)
    {
        $tenant = Tenant::create([
            'name' => $data['name'] . " Personal Page",
            'domain' => "-",
            'database' => "-",
        ]);

        $tenant->domain = $tenant->id . '-default';
        $tenant->database = $tenant->id . '-default';

        $tenant->save();

        return $tenant;
    }

    public function checkIfUserInTenant(User $user, $tenant_id)
    {
        if ($user->tenants()->where('tenants.id', $tenant_id)->exists()) {
            return true;
        }

        return false;
    }

    public function changeUserActiveTenantSession($tenant_id)
    {
        session(['active_tenant_id' => $tenant_id]);
    }
}
