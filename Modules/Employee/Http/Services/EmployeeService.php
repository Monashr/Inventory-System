<?php

namespace Modules\Employee\Http\Services;

use App\Models\User;
use App\Http\Services\TenantService;
use App\Http\Services\UserService;
use App\Http\Services\PositionService;
use App\Http\Services\RoleService;
use Illuminate\Http\Request;
use Modules\Employee\Http\Requests\CreateEmployeeRequest;

class EmployeeService
{
    public function __construct(
        protected TenantService $tenantService,
        protected UserService $userService,
        protected PositionService $positionService,
        protected RoleService $roleService,
    ) {
    }
    public function getAllEmployeePaginated($request, $perPage)
    {
        $tenantId = session('active_tenant_id');

        $query = User::with('positions')
            ->whereHas('tenants', function ($q) use ($tenantId) {
                $q->where('tenant_id', $tenantId);
            });

        $allowedSorts = ['name', 'email', 'bio', 'phone', 'address', 'created_at'];
        $allowedSearch = ['name', 'email', 'phone', 'address'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);

            $query->where(function ($q) use ($search, $allowedSearch) {
                foreach ($allowedSearch as $column) {
                    $q->orWhereRaw("LOWER($column) LIKE ?", ["%{$search}%"]);
                }
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function createNewEmployee(CreateEmployeeRequest $request)
    {
        $credentials = $request->validated();

        $tenant = $this->tenantService->createTenant($credentials);

        $position = $this->positionService->createPosition('employee', $tenant->id);

        $user = $this->userService->createUser($credentials);

        $role = $this->roleService->createRole('user', $tenant->id);
        
        $user->positions()->attach($position);

        $user->assignRole($tenant->id, $role);

        $user->tenants()->attach($tenant->id);

        $user->tenants()->attach(tenant());

        return $user;
    }
}