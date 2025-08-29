<?php

namespace App\Models;

use Spatie\Permission\Models\Role as Base;

class Role extends Base
{
    protected $fillable = [
        'name',
        'guard_name',
        'tenant_id',
    ];

    public function giveTenantPermissionTo($tenantId, ...$permissions)
    {
        $permissionClass = app(\Spatie\Permission\PermissionRegistrar::class)->getPermissionClass();

        $permissions = collect($permissions)
            ->flatten()
            ->map(function ($permission) use ($permissionClass) {
                return is_string($permission)
                    ? (new $permissionClass)->findByName($permission, $this->guard_name)
                    : $permission;
            })
            ->all();

        foreach ($permissions as $permission) {
            $exists = \DB::table('role_has_permissions')
                ->where('role_id', $this->id)
                ->where('permission_id', $permission->id)
                ->where('tenant_id', $tenantId)
                ->exists();

            if (! $exists) {
                \DB::table('role_has_permissions')->insert([
                    'role_id' => $this->id,
                    'permission_id' => $permission->id,
                    'tenant_id' => $tenantId,
                ]);
            }
        }

        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return $this;
    }
}
