<?php

namespace Modules\Loans\Http\Services;

use Modules\Loans\Models\Loan;

class LoanService
{
    public function getAllLoanPagination($request)
    {
        if ($this->checkManagePermissionForLoan()) {
            $query = Loan::select('loans.*', 'users.name as user_name')
                ->join('users', 'users.id', '=', 'loans.user_id');
        } else {
            $query = Loan::select('loans.*', 'users.name as user_name')
                ->join('users', 'users.id', '=', 'loans.user_id')
                ->where('user_id', auth()->id());
        }

        $perPage = $request->input('per_page', 10);

        if ($request->filled('status') && $request->status != 'All') {
            $query->where('status', 'LIKE', '%'.$request->status.'%');
        }

        $allowedSorts = ['name', 'status', 'description', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (! in_array($sortDirection, ['asc', 'desc'])) {
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

    public function getLoanWithAssetTypeAndUserById($loanId)
    {
        return Loan::with(['assets.assetType', 'user'])->findOrFail($loanId);
    }

    public function getUserForLoan()
    {
        if ($this->checkManagePermissionForLoan()) {
            dd(auth()->user()->usersFromSameTenant());

            return auth()->user()->usersFromSameTenant();
        } else {
            return [auth()->user()];
        }
    }

    public function checkAnyPermissionsForLoan()
    {
        if (
            (checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return true;
        }

        return false;
    }

    public function checkManagePermissionForLoan()
    {
        if (checkAuthority(config('loans.permissions')['permissions']['all loans'])) {
            return true;
        }

        return false;
    }

    public function checkIfUserCanAccessLoan($loan)
    {
        if (
            ! (checkAuthority(config('loans.permissions')['permissions']['all loans']) ||
                (checkAuthority(config('loans.permissions')['permissions']['own loans']) &&
                    $loan->user_id === auth()->id()))
        ) {
            return true;
        }

        return false;
    }

    public function getAllLoanStatuses()
    {
        $status = Loan::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->where('status', '!=', '')
            ->orderBy('status')
            ->get()
            ->pluck('status');

        return $status->prepend('All');
    }

    public function getAllLoanFilters()
    {
        return [
            'status' => $this->getAllLoanStatuses(),
        ];
    }
}
