<?php

namespace Modules\Loans\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Asset\Http\Services\AssetLogService;
use Modules\Asset\Http\Services\AssetService;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Modules\Asset\Http\Services\AssetTypeService;
use Modules\Asset\Models\AssetType;
use Illuminate\Support\Facades\DB;
use Modules\Asset\Models\Asset;
use Modules\Loans\Http\Services\LoanService;
use Modules\Loans\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class LoansController extends Controller
{

    protected $assetService;
    protected $assetLogService;
    protected $loanService;
    protected $assetTypeService;

    public function __construct(AssetService $assetService, AssetLogService $assetLogService, LoanService $loanService, AssetTypeService $assetTypeService)
    {
        $this->assetService = $assetService;
        $this->assetLogService = $assetLogService;
        $this->loanService = $loanService;
        $this->assetTypeService = $assetTypeService;
    }
    public function index(Request $request)
    {
        return Inertia::render('Loans/LoansIndex', [
            'loans' => $this->loanService->getAllLoanPagination($request),
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
                'status' => $request->status,
            ],
            'filterValues' => $this->loanService->getAllLoanFilters(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function showAddLoans(Request $request)
    {
        return Inertia::render('Loans/LoansAdd', [
            'assets' => $this->assetService->getAllAssetPagination($request, null, true),
            'users' => $this->loanService->getUserForLoan(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function store(Request $request)
    {
        if (!checkAuthority(config('loans.permissions')['permissions']['all loans']) && $request['loaner'] != auth()->user()->id) {
            return back()->withErrors(['error' => 'Error occurred while creating loan.']);
        } // check that user can only make loans for themself, except for all loans admin

        $validated = $request->validate([
            'loaner' => 'required|numeric',
            'description' => 'nullable|string|max:1000',
            'assets' => 'required|array|min:1',
            'assets.*.asset_type_id' => 'required|integer|exists:asset_types,id',
            'assets.*.asset_id' => 'required|integer|exists:assets,id',
            'assets.*.loaned_date' => 'required|date',
        ]); // need to make request

        DB::beginTransaction();

        try {
            $loan = Loan::create([
                'user_id' => $validated['loaner'],
                'description' => $validated['description'] ?? null,
                'tenant_id' => tenant(),
            ]); // make it function in service

            foreach ($validated['assets'] as $assetData) {
                $loan->assets()->attach($assetData['asset_id'], [
                    'loaned_date' => $assetData['loaned_date'],
                ]);

                Asset::where('id', $assetData['asset_id'])->update(['availability' => 'pending']);
                // make it function in asset service
            }

            DB::commit();

            return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error occurred while creating loan.']);
        }
    }

    public function showLoanDetails($loanId)
    {
        $loan = $this->loanService->getLoanWithAssetTypeAndUserById($loanId);

        if ($this->loanService->checkIfUserCanAccessLoan($loan)) {
            return redirect()->route('dashboard')->withErrors('You are not authorized to view this loan.');
        }

        return Inertia::render('Loans/LoansDetail', [
            'loan' => $loan,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function edit($id)
    {
        $loan = $this->loanService->getLoanWithAssetTypeAndUserById($id);

        if ($this->loanService->checkIfUserCanAccessLoan($loan)) {
            return redirect()->route('dashboard')->withErrors('You are not authorized to view this loan.');
        }

        return Inertia::render('Loans/LoansEdit', [
            'loan' => $loan,
            'assetTypes' => $this->assetTypeService->getAllAssetTypeWithAsset(),
            'users' => $this->loanService->getUserForLoan(),
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
        ]); // make request

        $loan = Loan::with(['user'])->findOrFail($id);
        // make function in service

        if (!(checkAuthority(config('loans.permissions')['permissions']['all loans']) || (checkAuthority(config('loans.permissions')['permissions']['own loans']) && $loan->user_id === auth()->id()))) {
            return redirect()->route('dashboard')->withErrors('You are not authorized to view this loan.');
        } // function checkIfUserCanAccessLoan

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

        // bellow make function in asset service
        Asset::whereIn('id', $removedAssetIds)->update(['availability' => 'available']);
        Asset::whereIn('id', $addedAssetIds)->update(['availability' => 'loaned']);

        return redirect()->route('loans.index')->with('success', 'Loan updated.');
    }

    public function acceptLoan(Loan $loan)
    {
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

        $loan->load('assets');

        $unavailableAssets = $loan->assets->filter(function ($asset) {
            return in_array($asset->availability, ['loaned', 'defect']);
        });

        if ($unavailableAssets->isNotEmpty()) {
            // $names = $unavailableAssets->pluck('serial_code')->implode(', ');
            return back();
        }

        $loan->update(['status' => 'accepted']);

        foreach ($loan->assets as $asset) {
            $asset->update(['availability' => 'loaned']);
            $this->assetLogService->userLoanAsset($asset);

            $loan->assets()->updateExistingPivot($asset->id, [
                'loaned_status' => 'loaned',
            ]);
        }

        return back()->with('success', 'Loan accepted.');
    }

    public function rejectLoan(Loan $loan)
    {
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

        $loan->load('assets.assetType');

        foreach ($loan->assets as $asset) {
            $asset->update(['availability' => 'available']);
        }

        $loan->update(['status' => 'rejected']);

        return back()->with('success', 'Loan declined.');
    }

    public function cancelLoan(Loan $loan)
    {
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

        $loan->load('assets.assetType');

        foreach ($loan->assets as $asset) {
            $asset->update(['availability' => 'available']);
        }

        $loan->update(['status' => 'cancelled']);

        return back()->with('success', 'Loan cancelled.');
    }

    public function returnAsset(Request $request, Loan $loan)
    {
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

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

        $asset = Asset::findOrFail($assetId);
        $asset->update([
            'availability' => 'available',
            'condition' => $request->return_condition,
        ]);

        $this->assetLogService->userReturnAsset($asset);

        return back()->with('success', 'Asset returned.');
    }

    public function uploadEvident(Request $request, Loan $loan)
    {
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

        $validated = $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,hvec|max:2048',
        ]);

        if ($request->hasFile('file')) {
            if ($loan->evident && Storage::disk('public')->exists($loan->evident)) {
                Storage::disk('public')->delete($loan->evident);
            }

            $manager = new ImageManager(new Driver());

            $image = $manager->read($request->file('file')->getRealPath());

            $image->cover(500, 500);

            $filename = uniqid('evident_') . '.jpg';
            $path = 'evident/' . $filename;

            Storage::disk('public')->put($path, (string) $image->toJpeg());

            $loan->update([
                'evident' => $path,
            ]);

            return back()->with('success', 'upload evident success.');
        }

        return back()->with('error', 'upload evident not success.');
    }

    public function uploadDocument(Request $request, Loan $loan)
    {
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

        $request->validate([
            'file' => 'required|file|mimes:pdf|max:2048',
        ]);


        if ($request->hasFile('file')) {
            if ($loan->document && Storage::disk('public')->exists($loan->document)) {
                Storage::disk('public')->delete($loan->document);
            }

            $extension = $request->file('file')->getClientOriginalExtension();

            $filename = uniqid('loan_document_') . '.' . $extension;
            $path = 'loan_document/' . $filename;

            $request->file('file')->storeAs('loan_document', $filename, 'public');

            $validated['document'] = $path;
            $loan->update($validated);

            return back()->with('success', 'upload evident success.');
        }

        return back()->with('error', 'upload evident not success.E');

    }
}