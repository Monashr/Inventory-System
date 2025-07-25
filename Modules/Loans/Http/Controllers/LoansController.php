<?php

namespace Modules\Loans\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Asset\Http\Services\AssetService;
use Modules\Asset\Models\AssetType;
use Illuminate\Support\Facades\DB;
use Modules\Asset\Models\Asset;
use Modules\Loans\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoansController extends Controller
{

    protected $assetService;

    public function __construct(AssetService $assetService)
    {
        $this->assetService = $assetService;
    }
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $loans = Loan::with('user')->paginate($perPage);

        return Inertia::render('Loans/LoansIndex', [
            'loans' => $loans,
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function concept(Request $request)
    {
        $perPage = 10;

        return Inertia::render('Loans/Concept', [
            'assets' => $this->assetService->getAssetPagination($request, $perPage),
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

                Asset::where('id', $assetData['asset_id'])->update(['avaibility' => 'pending']);
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

        $oldAssetIds = $loan->assets()->pluck('assets.id')->toArray();

        $loan->update([
            'user_id' => $request->loaner,
            'description' => $request->description,
        ]);

        $syncData = collect($request->assets)->mapWithKeys(function ($asset) {
            return [
                $asset['asset_id'] => [
                    'loaned_date' => $asset['loaned_date'],
                ],
            ];
        })->toArray();

        $loan->assets()->sync($syncData);

        $newAssetIds = array_keys($syncData);

        $removedAssetIds = array_diff($oldAssetIds, $newAssetIds);
        $addedAssetIds = array_diff($newAssetIds, $oldAssetIds);

        Asset::whereIn('id', $removedAssetIds)->update(['avaibility' => 'available']);
        Asset::whereIn('id', $addedAssetIds)->update(['avaibility' => 'loaned']);

        return redirect()->route('loans.index')->with('success', 'Loan updated.');
    }


    public function acceptLoan(Loan $loan)
    {
        $loan->load('assets');

        $unavailableAssets = $loan->assets->filter(function ($asset) {
            return in_array($asset->avaibility, ['loaned', 'defect']);
        });

        if ($unavailableAssets->isNotEmpty()) {
            $names = $unavailableAssets->pluck('serial_code')->implode(', ');
            return back()->withErrors(['message' => "Cannot accept loan. The following assets are not available: {$names}"]);
        }

        $loan->update(['status' => 'accepted']);

        foreach ($loan->assets as $asset) {
            $asset->update(['avaibility' => 'loaned']);

            $loan->assets()->updateExistingPivot($asset->id, [
                'loaned_status' => 'loaned',
            ]);
        }

        return back()->with('success', 'Loan accepted.');
    }


    public function rejectLoan(Loan $loan)
    {
        $loan->load('assets.assetType');

        foreach ($loan->assets as $asset) {
            $asset->update(['avaibility' => 'available']);
        }

        $loan->update(['status' => 'rejected']);

        return back()->with('success', 'Loan declined.');
    }

    public function cancelLoan(Loan $loan)
    {

        $loan->load('assets.assetType');

        foreach ($loan->assets as $asset) {
            $asset->update(['avaibility' => 'available']);
        }

        $loan->update(['status' => 'cancelled']);

        return back()->with('success', 'Loan cancelled.');
    }

    public function returnAsset(Request $request, Loan $loan)
    {
        $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'return_date' => 'required|date',
            'return_condition' => 'required|in:good,used,defect',
        ]);

        $assetId = $request->asset_id;

        $loanAsset = $loan->assets()->where('asset_id', $assetId)->first();

        if (!$loanAsset) {
            return back()->withErrors(['message' => 'Asset not part of this loan.']);
        }

        $loan->assets()->updateExistingPivot($assetId, [
            'loaned_status' => 'returned',
            'return_date' => $request->return_date,
            'return_condition' => $request->return_condition,
        ]);

        Asset::find($assetId)->update([
            'avaibility' => 'available',
        ]);

        return back()->with('success', 'Asset marked as returned.');
    }


}
