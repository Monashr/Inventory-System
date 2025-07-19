<?php

namespace App\Http\Services;

use App\Models\Role;

class RoleService
{
    public function createRole(String $name, $tenant_id)
    {
        $role = Role::firstOrCreate([
            'name' => $name,
            'tenant_id' => $tenant_id,
        ]);

        return $role;
    }
}
