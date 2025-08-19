<?php

namespace Modules\Loans\Http\Services;

use Modules\Loans\Models\Loan;

class LoanService
{
    public function getAllLoanPagination($request, $perPage)
    {
        $query = Loan::select('loans.*', 'users.name as user_name')
                ->join('users', 'users.id', '=', 'loans.user_id');

        if ($request->filled('status')) {
            $query->where('status', 'LIKE', '%' . $request->status . '%');
        }

        $allowedSorts = ['name', 'status', 'description', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(status) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getAllLoanStatuses()
    {
        return Loan::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->where('status', '!=', '')
            ->orderBy('status')
            ->get()
            ->pluck('status');
    }

    public function getAllLoanFilters()
    {
        return [
            'status' => $this->getAllLoanStatuses(),
        ];
    }

}