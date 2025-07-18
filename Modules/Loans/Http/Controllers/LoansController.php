<?php

namespace Modules\Loans\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Modules\Asset\Models\AssetType;
use Illuminate\Support\Facades\DB;
use Modules\Asset\Models\Asset;
use Modules\Loans\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoansController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $loans = Loan::with('user')->paginate($perPage);

        return Inertia::render('Loans/LoansIndex', [
            'loans' => $loans,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function showAddLoans()
    {

        $assetTypes = AssetType::all();
        $users = auth()->user()->usersFromSameTenant();

        return Inertia::render('Loans/LoansAdd', [
            'assetTypes' => $assetTypes,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'loaner' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'assets' => 'required|array|min:1',
            'assets.*.asset_type_id' => 'required|integer|exists:asset_types,id',
            'assets.*.asset_id' => 'required|integer|exists:assets,id',
            'assets.*.loaned_date' => 'required|date',
        ]);

        DB::beginTransaction();

        try {
            $loan = Loan::create([
                'user_id' => $validated['loaner'],
                'description' => $validated['description'] ?? null,
                'tenant_id' => tenant(),
            ]);

            foreach ($validated['assets'] as $assetData) {
                $loan->assets()->attach($assetData['asset_id'], [
                    'loaned_date' => $assetData['loaned_date'],
                ]);

                Asset::where('id', $assetData['asset_id'])->update(['avaibility' => 'loaned']);
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
        $loan = Loan::with(['assets.assetType', 'user'])->findOrFail($loanId);

        return Inertia::render('Loans/LoansDetail', [
            'loan' => $loan,
        ]);
    }

    public function edit($id)
    {
        $loan = Loan::with(['assets.assetType', 'user'])->findOrFail($id);
        $assetTypes = AssetType::with('assets')->get();
        $users = auth()->user()->usersFromSameTenant();

        return Inertia::render('Loans/LoansEdit', [
            'loan' => $loan,
            'assetTypes' => $assetTypes,
            'users' => $users,
        ]);
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'loaner' => 'required|exists:users,id',
        'description' => 'nullable|string',
        'assets' => 'required|array',
        'assets.*.asset_id' => 'required|exists:assets,id',
        'assets.*.asset_type_id' => 'required|exists:asset_types,id',
        'assets.*.loaned_date' => 'required|date',
    ]);

    $loan = Loan::findOrFail($id);

    $loan->user_id = $request->loaner;
    $loan->description = $request->description;
    $loan->save();

    $currentAssetIds = $loan->assets()->pluck('assets.id')->toArray();

    $newAssetIds = collect($request->assets)->pluck('asset_id')->toArray();

    $removedAssetIds = array_diff($currentAssetIds, $newAssetIds);

    Asset::whereIn('id', $removedAssetIds)->update(['avaibility' => 'available']);

    Asset::whereIn('id', $newAssetIds)->update(['avaibility' => 'loaned']);

    $loan->assets()->sync(
        collect($request->assets)->mapWithKeys(function ($asset) {
            return [
                $asset['asset_id'] => [
                    'loaned_date' => $asset['loaned_date'],
                ],
            ];
        })->toArray()
    );

    return redirect()->route('loans.index')->with('success', 'Loan updated.');
}


}
