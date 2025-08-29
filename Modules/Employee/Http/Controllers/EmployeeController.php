<?php

namespace Modules\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Modules\Employee\Http\Requests\CreateEmployeeRequest;
use Modules\Employee\Http\Services\EmployeeService;
use Spatie\Permission\Models\Permission;

class EmployeeController extends Controller
{
    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    public function index(Request $request)
    {
        return Inertia::render('Employee/EmployeesIndex', [
            'employees' => $this->employeeService->getAllEmployeePaginated($request),
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
            'authUser' => auth()->user(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function showPermission(Request $request, $id)
    {
        $permission = config('employee.permissions')['permissions']['permission employees'];

        if (! checkAuthority($permission)) {
            return redirect()->route('employees.index');

        }

        $allowedUsers = auth()->user()->usersFromSameTenant()->pluck('id')->toArray();

        if (! in_array($id, $allowedUsers) || auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $user = User::with('roles')->findOrFail($id);

        $tenantId = session('active_tenant_id');

        $roleIds = $user->roles->pluck('id');

        $rolePermissions = DB::table('role_has_permissions')
            ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
            ->whereIn('role_has_permissions.role_id', $roleIds)
            ->where('role_has_permissions.tenant_id', $tenantId)
            ->select('permissions.name')
            ->distinct()
            ->orderBy('permissions.name')
            ->paginate(10);

        return Inertia::render('Employee/EmployeesPermission', [
            'employee' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'permissions' => auth()->user()->getTenantPermission(),
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function showAddPermissionForm($id)
    {
        $permission = config('employee.permissions')['permissions']['permission employees'];

        if (! checkAuthority($permission)) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $tenantId = session('active_tenant_id');

        $user = User::with('positions')->findOrFail($id);

        $permissions = Permission::where('guard_name', 'web')->get();

        $assignedPermissions = DB::table('users as u')
            ->join('model_has_roles as mhr', function ($join) use ($user) {
                $join->on('u.id', '=', 'mhr.model_id')
                    ->where('mhr.model_id', '=', $user->id);
            })
            ->join('role_has_permissions as rhp', function ($join) use ($tenantId) {
                $join->on('mhr.role_id', '=', 'rhp.role_id')
                    ->where('rhp.tenant_id', '=', $tenantId);
            })
            ->join('permissions as p', 'rhp.permission_id', '=', 'p.id')
            ->where('u.id', $id)
            ->select('p.id')
            ->distinct()
            ->pluck('id')
            ->toArray();

        return Inertia::render('Employee/EmployeesAssignPermission', [
            'user' => $user,
            'permissions' => $permissions,
            'assignedPermissions' => $assignedPermissions,
        ]);
    }

    public function assignPermissions(Request $request, $id)
    {
        $permission = config('employee.permissions')['permissions']['permission employees'];

        if (! checkAuthority($permission)) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $validated = $request->validate([
            'assignedPermissions' => 'array',
            'assignedPermissions.*' => 'integer|exists:permissions,id',
            'position' => 'nullable|string|max:255',
        ]);

        if ($validated['position'] == null) {
            $validated['position'] = 'employee';
        }

        $position = Position::firstOrCreate(
            ['name' => $validated['position'], 'tenant_id' => tenant()->id]
        );

        $user = User::findOrFail($id);

        $user->positions()->sync([$position->id]);

        $tenantId = session('active_tenant_id');
        $roleId = $id;

        DB::table('role_has_permissions')
            ->where('role_id', $roleId)
            ->where('tenant_id', $tenantId)
            ->delete();

        $newPermissions = collect($request->assignedPermissions)->map(function ($permissionId) use ($roleId, $tenantId) {
            return [
                'permission_id' => $permissionId,
                'role_id' => $roleId,
                'tenant_id' => $tenantId,
            ];
        });

        if ($newPermissions->isNotEmpty()) {
            DB::table('role_has_permissions')->insert($newPermissions->toArray());
        }

        return redirect()->back()->with('success', 'Permissions updated successfully.');
    }

    public function deleteUserFromTenant($id)
    {
        if (! checkAuthority(config('employee.permissions')['permissions']['delete employees'])) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $tenantId = session('active_tenant_id');

        $this->revokeAllUserPermissions($tenantId, $id);

        DB::table('tenant_user')
            ->where('user_id', $id)
            ->where('tenant_id', $tenantId)
            ->delete();

        return redirect()->route('employees.index')->with('success', 'User Deleted Successfully.');
    }

    public function revokeAllPermissions($id)
    {
        if (! checkAuthority(config('employee.permissions')['permissions']['permission employees'])) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $tenantId = session('active_tenant_id');

        $this->revokeAllUserPermissions($tenantId, $id);

        return redirect()->back()->with('success', 'All permissions revoked successfully.');
    }

    private function revokeAllUserPermissions($tenantId, $id)
    {
        $user = User::findOrFail($id);

        DB::table('role_has_permissions')
            ->where('role_id', $id)
            ->where('tenant_id', $tenantId)
            ->delete();

        $user->positions()->detach();
    }

    public function showCreateEmployeeForm()
    {
        return Inertia::render('Employee/EmployeesCreate');
    }

    public function storeEmployee(CreateEmployeeRequest $request)
    {
        $this->employeeService->createNewEmployee($request);

        return redirect()->route('employees.index')->with('success', 'Employee added successfully.');
    }
}
