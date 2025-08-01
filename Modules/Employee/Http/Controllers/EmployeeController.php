<?php

namespace Modules\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Modules\Employee\Http\Requests\CreateEmployeeRequest;
use Modules\Employee\Http\Services\EmployeeService;
use Modules\Employee\Models\Inbox;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;


class EmployeeController extends Controller
{
    protected $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }
    public function index(Request $request)
    {

        $permission = config('employee.permissions')['permissions']['view'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        $employees = $this->employeeService->getAllEmployeePaginated($request, $perPage);

        return Inertia::render('Employee/EmployeesIndex', [
            'employees' => $employees,
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
            'authUser' => auth()->user(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function store(Request $request)
    {
        $permission = config('employee.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('employees.index');
        }

        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'No user found with this email.']);
        }

        $tenantId = session('active_tenant_id');

        if ($user->tenants()->where('tenant_id', $tenantId)->exists()) {
            return back()->withErrors(['email' => 'This user is already part of the tenant.']);
        }

        Inbox::create([
            'name' => auth()->user()->name,
            'sender_id' => auth()->id(),
            'receiver_id' => $user->id,
            'tenant_id' => $tenantId,
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee successfully added to tenant.');
    }


    public function showInbox(Request $request)
    {
        $inboxes = Inbox::with(['sender', 'tenant', 'receiver'])
            ->where(function ($query) {
                $query->where('receiver_id', auth()->id())
                    ->orWhere('sender_id', auth()->id());
            })
            ->latest()
            ->paginate(10);

        return Inertia::render("Employee/EmployeesInbox", [
            'inboxes' => $inboxes,
            'user' => auth()->user(),
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
        ]);
    }

    public function acceptInvitation($id)
    {
        $inbox = Inbox::findOrFail($id);

        if ($inbox->receiver_id !== auth()->user()->id) {
            abort(403);
        }

        $user = auth()->user();
        $tenantId = $inbox->tenant_id;

        if (!$user->tenants()->where('tenant_id', $tenantId)->exists()) {
            $user->tenants()->attach($tenantId);
        }

        $inbox->update([
            'status' => 'accepted',
        ]);

        return redirect()->back()->with('success', 'Invitation Accepted.');
    }

    public function declineInvitation($id)
    {
        $inbox = Inbox::findOrFail($id);

        if ($inbox->receiver_id !== auth()->user()->id) {
            abort(403);
        }

        $inbox->update([
            'status' => 'rejected',
        ]);

        return redirect()->back()->with('info', 'Invitation declined.');
    }

    public function showPermission(Request $request, $id)
    {
        $permission = config('employee.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $tenantId = session('active_tenant_id');
        $user = User::with('roles')->findOrFail($id);

        $roleIds = $user->roles->pluck('id');

        $rolePermissions = DB::table('role_has_permissions')
            ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
            ->whereIn('role_has_permissions.role_id', $roleIds)
            ->where('role_has_permissions.tenant_id', $tenantId)
            ->select('permissions.name')
            ->distinct()
            ->orderBy('permissions.name')
            ->paginate(10);

        return Inertia::render("Employee/EmployeesPermission", [
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
        $permission = config('employee.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $tenantId = session('active_tenant_id');

        $user = User::with('positions')->findOrFail($id);

        $permissions = Permission::where('guard_name', "web")->get();

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
        $permission = config('employee.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
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
            $validated['position'] = "employee";
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

    public function deleteUserFromTenant($id) {
        if (!checkAuthority(config('employee.permissions')['permissions']['edit'])) {
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
        if (!checkAuthority(config('employee.permissions')['permissions']['edit'])) {
            return redirect()->route('employees.index');
        }

        if (auth()->user()->id == $id) {
            return redirect()->route('employees.index');
        }

        $tenantId = session('active_tenant_id');

        $this->revokeAllUserPermissions($tenantId, $id);

        return redirect()->back()->with('success', 'All permissions revoked successfully.');
    }

    private function revokeAllUserPermissions($tenantId, $id) {
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
