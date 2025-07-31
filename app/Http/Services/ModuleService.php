<?php

namespace App\Http\Services;

use App\Models\Role;
use App\Models\Tenant;
use Nwidart\Modules\Facades\Module;

class ModuleService
{
    public function giveRoleAllPermissionToActiveModule(Role $role, Tenant $tenant)
    {
        $modules = Module::allEnabled();

        foreach ($modules as $module) {
            $moduleName = $module->getLowerName();

            $permissions = config("$moduleName.permissions", []);

            if (!empty($permissions)) {
                $role->giveTenantPermissionTo($tenant->id, ...$permissions);
            }
        }
    }
}
