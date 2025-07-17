<?php

namespace Modules\Loans\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Items\Models\Item;
use Modules\Loans\Models\Loan;
use Modules\Items\Models\Unit;
use Illuminate\Support\Facades\DB;

class LoansController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $loans = Loan::paginate($perPage);

        return Inertia::render('Loans/LoansIndex', [
            'loans' => $loans,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function showAddLoans()
    {

        $items = Item::all();

        return Inertia::render('Loans/LoansAdd', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'units' => 'required|array|min:1',
            'units.*.item_id' => 'required|integer|exists:items,id',
            'units.*.unit_id' => 'required|integer|exists:units,id',
            'units.*.due_date' => 'required|date',
            // 'units.*.return_date' => 'required|date|after_or_equal:units.*.due_date',
        ]);

        DB::beginTransaction();

        try {

            $loan = Loan::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'tenant_id' => tenant(),
            ]);

            foreach ($validated['units'] as $unitData) {
                $loan->unit()->attach($unitData['unit_id'], [
                    'due_date' => $unitData['due_date'],
                ]);


                Unit::where('id', $unitData['unit_id'])->update(['available' => false]);
            }

            DB::commit();

            return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            report($e);

            dd($e);
            return back()->withErrors(['error' => 'An error occurred while creating the loan.']);
        }
    }

    public function showLoanDetails($loanId)
    {
        $loan = Loan::with('unit.item')->findOrFail($loanId);

        return Inertia::render('Loans/LoansDetail', [
            'loan' => $loan,
        ]);
    }


}
