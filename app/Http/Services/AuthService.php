<?php

namespace App\Http\Services;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AuthService
{
    public function __construct(
        protected TenantService $tenantService,
        protected UserService $userService,
        protected PositionService $positionService,
        protected RoleService $roleService,
        protected ModuleService $moduleService
    ) {
    }

    public function redirectToDashboardIfAlreadyAuthenticated()
    {
        if (auth()->check()) {
            return redirect()->intended('/dashboard')->send();
        }
    }

    public function login(array $credentials, LoginRequest $request): bool
    {
        if (auth()->attempt($credentials)) {
            $request->session()->regenerate();

            return true;
        }

        return false;
    }

    public function register(RegisterRequest $request): User
    {
        $credentials = $request->validated();

        $tenant = $this->tenantService->createTenant($credentials);

        $position = $this->positionService->createPosition('owner', $tenant->id);

        $user = $this->userService->createUser($credentials);

        $role = $this->roleService->createRole('user', $tenant->id);
        
        $user->positions()->attach($position);

        $user->assignRole($tenant->id, $role);

        $user->tenants()->attach($tenant->id);

        $this->moduleService->giveRoleAllPermissionToActiveModule($role, $tenant);

        return $user;
    }

    public function logout(Request $request) {
        auth()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
