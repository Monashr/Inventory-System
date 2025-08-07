<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\Asset;

class AssetService
{

    protected $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function getPaginatedAssetsByAssetType($request, $assetTypeId, $perPage = 10)
    {
        $query = Asset::query()->where('asset_type_id', $assetTypeId);

        $allowedSorts = ['serial_code', 'brand', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'serial_code';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(brand) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(serial_code) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getTotalAvailableAssets($assetType = null)
    {
        if ($assetType) {
            return Asset::where('asset_type_id', $assetType)
                ->where('avaibility', 'available')
                ->count();
        }

        return Asset::where('avaibility', 'available')->count();
    }

    public function getTotalAssets($assetType = null)
    {
        if ($assetType) {
            return Asset::where('asset_type_id', $assetType)->count();
        }

        return Asset::count();
    }

    public function getTotalLoanedAssets($assetType = null)
    {
        if ($assetType) {
            return Asset::where('asset_type_id', $assetType)
                ->where('avaibility', 'loaned')
                ->count();
        }

        return Asset::where('avaibility', 'loaned')->count();
    }

    public function getTotalDefectAssets($assetType = null)
    {
        if ($assetType) {
            return Asset::where('asset_type_id', $assetType)
                ->where('avaibility', 'defect')
                ->count();
        }

        return Asset::where('avaibility', 'defect')->count();
    }

    public function getTotalAssetsInRepair($assetType = null)
    {
        if ($assetType) {
            return Asset::with(['repairs'])->where('asset_type_id', $assetType)
                ->where('avaibility', 'repair')
                ->count();
        }

        return Asset::where('avaibility', 'repair')->count();
    }

    public function getRecentAssetsInRepair()
    {
        return Asset::with(['loans'])->where('avaibility', 'repair')->orderBy('updated_at', 'desc')->take(5)->get();
    }

    public function getRecentLoanedAssets()
    {
        return Asset::with(['loans'])->where('avaibility', 'loaned')->orderBy('updated_at', 'desc')->take(5)->get();
    }

    public function getAssetPagination($request, $perPage)
    {
        $query = Asset::query();

        if ($request->filled('brand')) {
            $query->where('brand', 'LIKE', '%' . $request->brand . '%');
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        if ($request->filled('avaibility')) {
            $query->where('avaibility', $request->avaibility);
        }

        $query->where('avaibility', 'available');

        $allowedSorts = ['serial_code', 'brand', 'condition', 'avaibility', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'serial_code';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(brand) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(serial_code) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getAllAssetPagination($request, $perPage)
    {
        $query = Asset::query();

        if ($request->filled('brand')) {
            $query->where('brand', 'LIKE', '%' . $request->brand . '%');
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        if ($request->filled('avaibility')) {
            $query->where('avaibility', $request->avaibility);
        }


        $allowedSorts = ['serial_code', 'brand', 'condition', 'avaibility', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'serial_code';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(brand) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(serial_code) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function findAsset($asset)
    {
        return Asset::findOrFail($asset);
    }

    public function findAssetWithDetails($asset)
    {
        return Asset::with('assetType', 'location')->findOrFail($asset);
    }

    public function getAvailableAssetsByAssetType($assetType, $loanId = null)
    {
        return Asset::where('asset_type_id', $assetType)
            ->where(function ($query) use ($loanId) {
                $query->where(function ($q) {
                    $q->where('avaibility', 'available')
                        ->where('condition', '!=', 'defect');
                });

                if ($loanId) {
                    $query->orWhereHas('loans', function ($subQ) use ($loanId) {
                        $subQ->where('loans.id', $loanId);
                    });
                }
            })
            ->get(['id', 'serial_code', 'condition', 'specification', 'brand']);
    }

    public function getAvailableAssetPagination($request, $perPage)
    {
        $query = Asset::query()->where('avaibility', 'available')->where('condition', '!=', 'defect');

        $allowedSorts = ['serial_code', 'brand', 'condition', 'avaibility', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'serial_code';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(brand) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(serial_code) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getAllAssetBrands()
    {
        return Asset::select('brand')
            ->distinct()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->orderBy('brand')
            ->get()
            ->pluck('brand');
    }

    public function createAsset($validated, $assetType)
    {
        $user_id = auth()->user()->id;

        return Asset::create([
            'asset_type_id' => $assetType->id,
            'serial_code' => $validated['serial_code'],
            'brand' => $validated['brand'],
            'specification' => $validated['specification'],
            'purchase_date' => $validated['purchase_date'],
            'purchase_price' => $validated['purchase_price'],
            'initial_condition' => $validated['initial_condition'],
            'condition' => $validated['condition'],
            'avaibility' => $validated['avaibility'],
            'created_by' => $user_id,
            'updated_by' => $user_id,
            'location_id' => $this->locationService->getOrCreateDefaultLocation()->id,
            'tenant_id' => auth()->user()->tenant_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}