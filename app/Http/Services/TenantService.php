<?php

namespace App\Http\Services;

use App\Models\Tenant;
use App\Models\User;
use Modules\Asset\Http\Services\LocationService;

class TenantService
{
    protected $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function createTenant(array $data)
    {
        $tenant = Tenant::create([
            'name' => $data['name'].' Personal Page',
            'domain' => '-',
            'database' => '-',
        ]);

        $tenant->domain = $tenant->id.'-default';
        $tenant->database = $tenant->id.'-default';

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

    public function changeDefaultAddress($string)
    {
        $this->locationService->changeDefaultLocationAddress($string);
    }

    public function getRecentUsersInTenant($tenant_id)
    {
        return Tenant::find($tenant_id)
            ->users()
            ->orderByPivot('created_at', 'desc')
            ->take(5)
            ->get();
    }
}
