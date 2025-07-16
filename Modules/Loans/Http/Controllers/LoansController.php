<?php

namespace Modules\Loans\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Loans\Models\Loan;

class LoansController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $loans = Loan::paginate($perPage);

        return Inertia::render('Loans/LoansIndex', [
            'loans' => $loans
        ]);
    }
}
