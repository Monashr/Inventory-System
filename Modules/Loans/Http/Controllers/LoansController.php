<?php

namespace Modules\Loans\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Asset\Http\Services\AssetLogService;
use Modules\Asset\Http\Services\AssetService;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Modules\Asset\Models\AssetType;
use Illuminate\Support\Facades\DB;
use Modules\Asset\Models\Asset;
use Modules\Loans\Models\Loan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class LoansController extends Controller
{

    protected $assetService;
    protected $assetLogService;

    public function __construct(AssetService $assetService, AssetLogService $assetLogService)
    {
        $this->assetService = $assetService;
        $this->assetLogService = $assetLogService;
    }
    public function index(Request $request)
    {
        if (
            !(checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        if (checkAuthority(config('loans.permissions')['permissions']['all loans'])) {
            $loans = Loan::with('user')->paginate($perPage);
        } else {
            $loans = $loans = Loan::with('user')
                ->where('user_id', auth()->id())
                ->paginate($perPage);
        }

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

    public function showAddLoans(Request $request)
    {
        if (
            !(checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return redirect()->route('dashboard.index');
        }

        if (checkAuthority(config('loans.permissions')['permissions']['all loans'])) {
            $users = auth()->user()->usersFromSameTenant();
        } else {
            $users = [auth()->user()];
        }

        $perPage = $request->input('per_page', 10);

        return Inertia::render('Loans/LoansAdd', [
            'assets' => $this->assetService->getAvailableAssetPagination($request, $perPage),
            'users' => $users,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function store(Request $request)
    {
        if (
            !(checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return redirect()->route('dashboard.index');
        }

        if (!checkAuthority(config('loans.permissions')['permissions']['all loans']) && $request['loaner'] != auth()->user()->id) {
            return back()->withErrors(['error' => 'Error occurred while creating loan.']);
        }

        $validated = $request->validate([
            'loaner' => 'required|numeric',
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
        } catch (Exception $e) {
            DB::rollBack();
            report($e);
            return back()->withErrors(['error' => 'Error occurred while creating loan.']);
        }
    }

    public function showLoanDetails($loanId)
    {
        if (
            !(checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return redirect()->route('dashboard.index');
        }

        $loan = Loan::with(['assets.assetType', 'user'])->findOrFail($loanId);

        if (!(checkAuthority(config('loans.permissions')['permissions']['all loans']) || (checkAuthority(config('loans.permissions')['permissions']['own loans']) && $loan->user_id === auth()->id()))) {
            return redirect()->route('dashboard')->withErrors('You are not authorized to view this loan.');
        }

        return Inertia::render('Loans/LoansDetail', [
            'loan' => $loan,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function edit($id)
    {
        if (
            !(checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return redirect()->route('dashboard.index');
        }

        $loan = Loan::with(['assets.assetType', 'user'])->findOrFail($id);

        if (!(checkAuthority(config('loans.permissions')['permissions']['all loans']) || (checkAuthority(config('loans.permissions')['permissions']['own loans']) && $loan->user_id === auth()->id()))) {
            return redirect()->route('dashboard')->withErrors('You are not authorized to view this loan.');
        }

        $assetTypes = AssetType::with('assets')->get();

        if ((checkAuthority(config('loans.permissions')['permissions']['all loans']))) {
            $users = auth()->user()->usersFromSameTenant();
        } else {
            $users = auth()->user();
        }


        return Inertia::render('Loans/LoansEdit', [
            'loan' => $loan,
            'assetTypes' => $assetTypes,
            'users' => $users,
        ]);
    }

    public function update(Request $request, $id)
    {
        if (
            !(checkAuthority(config('loans.permissions')['permissions']['own loans']) ||
                checkAuthority(config('loans.permissions')['permissions']['all loans']))
        ) {
            return redirect()->route('dashboard.index');
        }

        $request->validate([
            'loaner' => 'required|exists:users,id',
            'description' => 'nullable|string',
            'assets' => 'required|array',
            'assets.*.asset_id' => 'required|exists:assets,id',
            'assets.*.asset_type_id' => 'required|exists:asset_types,id',
            'assets.*.loaned_date' => 'required|date',
        ]);

        $loan = Loan::with(['user'])->findOrFail($id);

        if (!(checkAuthority(config('loans.permissions')['permissions']['all loans']) || (checkAuthority(config('loans.permissions')['permissions']['own loans']) && $loan->user_id === auth()->id()))) {
            return redirect()->route('dashboard')->withErrors('You are not authorized to view this loan.');
        }

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
        if (
            !checkAuthority(config('loans.permissions')['permissions']['decision loans'])
        ) {
            return redirect()->route('dashboard');
        }

        $loan->load('assets');

        $unavailableAssets = $loan->assets->filter(function ($asset) {
            return in_array($asset->avaibility, ['loaned', 'defect']);
        });

        if ($unavailableAssets->isNotEmpty()) {
            // $names = $unavailableAssets->pluck('serial_code')->implode(', ');
            return back();
        }

        $loan->update(['status' => 'accepted']);

        foreach ($loan->assets as $asset) {
            $asset->update(['avaibility' => 'loaned']);
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
            $asset->update(['avaibility' => 'available']);
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
            $asset->update(['avaibility' => 'available']);
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
            'avaibility' => 'available',
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