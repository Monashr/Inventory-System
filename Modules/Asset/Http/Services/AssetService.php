<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\Asset;

class AssetService
{
    public function __construct(
        protected LocationService $locationService,
        protected AssetLogService $assetLogService,
        protected AssetTypeService $assetTypeService,
    ) {}

    // INFORMATION QUERY
    // --------------------------------------------------------------------------------------------------------
    public function getTotalAvailableAssets($assetType = null)
    {
        if ($assetType) {
            return Asset::where('asset_type_id', $assetType)
                ->where('availability', 'available')
                ->count();
        }

        return Asset::where('availability', 'available')->count();
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
                ->where('availability', 'loaned')
                ->count();
        }

        return Asset::where('availability', 'loaned')->count();
    }

    public function getTotalDefectAssets($assetType = null)
    {
        if ($assetType) {
            return Asset::where('asset_type_id', $assetType)
                ->where('availability', 'defect')
                ->count();
        }

        return Asset::where('availability', 'defect')->count();
    }

    public function getTotalAssetsInRepair($assetType = null)
    {
        if ($assetType) {
            return Asset::with(['repairs'])->where('asset_type_id', $assetType)
                ->where('availability', 'repair')
                ->count();
        }

        return Asset::where('availability', 'repair')->count();
    }

    public function getRecentAssetsInRepair()
    {
        return Asset::with(['loans'])->where('availability', 'repair')->orderBy('updated_at', 'desc')->take(5)->get();
    }

    public function getRecentLoanedAssets()
    {
        return Asset::with(['loans'])->where('availability', 'loaned')->orderBy('updated_at', 'desc')->take(5)->get();
    }

    // BASIC QUERY
    // --------------------------------------------------------------------------------------------------------

    public function getAllAssetPagination($request, $assetTypeId = null, $available = false)
    {
        $perPage = $request->input('per_page', 10);

        if ($assetTypeId) {
            $query = Asset::query()->where('asset_type_id', $assetTypeId);
        } elseif ($available) {
            $query = Asset::query()->where('availability', 'available')->where('condition', '!=', 'defect');
        } else {
            $query = Asset::query();
        }

        if ($request->filled('brand') && $request->brand != 'All') {
            $query->where('brand', 'LIKE', '%'.$request->brand.'%');
        }

        if ($request->filled('condition') && $request->condition != 'All') {
            $query->where('condition', $request->condition);
        }

        if ($request->filled('type') && $request->type != 'All') {
            $query->whereHas('assetType', function ($q) use ($request) {
                $q->where('name', $request->type);
            });
        }

        if (! $this->canManageAsset()) {
            $query->where('availability', 'available');
        }

        $allowedSorts = ['serial_code', 'brand', 'condition', 'availability', 'created_at'];

        $sortBy = $request->get('sort_by');
        if (! in_array($sortBy, $allowedSorts)) {
            $sortBy = 'serial_code';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (! in_array($sortDirection, ['asc', 'desc'])) {
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

    public function getAvailableAssetsByAssetType($assetType, $loanId = null)
    {
        return Asset::where('asset_type_id', $assetType)
            ->where(function ($query) use ($loanId) {
                $query->where(function ($q) {
                    $q->where('availability', 'available')
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

    public function getAllAssetsByAssetType($assetType)
    {
        return Asset::where('asset_type_id', $assetType)->get();
    }

    public function findAsset($asset)
    {
        return Asset::findOrFail($asset);
    }

    public function findAssetWithDetails($asset)
    {
        return Asset::with('assetType', 'location')->findOrFail($asset);
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
            'availability' => $validated['availability'],
            'created_by' => $user_id,
            'updated_by' => $user_id,
            'location_id' => $this->locationService->getOrCreateDefaultLocation()->id,
            'tenant_id' => auth()->user()->tenant_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function deleteAsset($asset)
    {
        $asset = $this->findAsset($asset);

        if ($asset->availability == 'repair') {
            return false;
        }

        $asset->deleted_by = auth()->id();

        $asset->save();

        $asset->delete();

        $this->assetLogService->userDeleteAsset($asset);

        return true;
    }

    public function storeAsset($request)
    {
        $validated = $request->validated();

        $assetType = $this->assetTypeService->findAssetType($validated['asset_type_id']);

        $validated['serial_code'] = $this->generateSerialFromType($assetType->code);

        $asset = $this->createAsset($validated, $assetType);

        $this->assetLogService->userAddAsset($asset);
    }

    public function generateSerialFromType($code)
    {
        if (! $code) {
            $slug = 'unknown';
        } else {
            $slug = strtolower($code);
            $slug = preg_replace('/\s+/', '-', $slug);
            $slug = preg_replace('/[^\w\-]+/', '', $slug);
        }

        $now = (int) round(microtime(true) * 1000);

        return "{$slug}-{$now}";
    }

    public function updateAsset($request, $asset)
    {
        $validated = $request->validated();

        $asset->update($validated);

        $this->assetLogService->userEditAsset($asset);
    }

    // AUTHORITY CHECK
    // --------------------------------------------------------------------------------------------------------

    public function canManageAsset()
    {
        return checkAuthority(config('asset.permissions')['permissions']['manage']);
    }

    public function canAuditAsset()
    {
        return checkAuthority(config('asset.permissions')['permissions']['audit']);
    }

    // FILTERS
    // --------------------------------------------------------------------------------------------------------

    public function getAllAssetBrands()
    {
        $brands = Asset::select('brand')
            ->distinct()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->orderBy('brand')
            ->get()
            ->pluck('brand');

        return $brands->prepend('All');
    }

    public function getAllAssetBrandsNoAll()
    {
        return Asset::select('brand')
            ->distinct()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->orderBy('brand')
            ->get()
            ->pluck('brand');
    }

    public function getAllAssetConditions()
    {
        $conditions = Asset::select('condition')
            ->distinct()
            ->whereNotNull('condition')
            ->where('condition', '!=', '')
            ->orderBy('condition')
            ->get()
            ->pluck('condition');

        return $conditions->prepend('All');
    }

    public function getAllAssetTypes()
    {
        $assetTypes = Asset::withoutGlobalScope('tenant')
            ->join('asset_types', 'assets.asset_type_id', '=', 'asset_types.id')
            ->whereNotNull('asset_types.name')
            ->where('asset_types.name', '!=', '')
            ->where('assets.tenant_id', tenant()->id)
            ->select('asset_types.name')
            ->distinct()
            ->orderBy('asset_types.name')
            ->pluck('asset_types.name');

        return $assetTypes->prepend('All');
    }

    public function getAllAssetFilterValues()
    {
        return [
            'type' => $this->getAllAssetTypes(),
            'brand' => $this->getAllAssetBrands(),
            'condition' => $this->getAllAssetConditions(),
        ];
    }

    public function getAllAssetFilter($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'brand' => $request->brand,
            'condition' => $request->condition,
            'type' => $request->type,
        ];
    }
}
