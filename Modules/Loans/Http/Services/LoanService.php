<?php

namespace Modules\Loans\Http\Services;

use Modules\Loans\Models\Loan;

class LoanService
{
    public function getCurrentlyLoan()
    {
        $loans = Loan::orderBy('created_at', 'desc')->take(5)->get();

        return $loans;
    }

}