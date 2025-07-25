<?php

namespace Modules\Employee\Http\Services;

use App\Models\User;

class EmployeeService
{
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

        // Search
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


}