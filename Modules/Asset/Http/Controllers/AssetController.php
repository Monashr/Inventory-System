<?php

namespace Modules\Asset\Http\Controllers;

use Modules\Asset\Http\Requests\UpdateAssetRequest;
use Modules\Asset\Http\Services\AssetTypeService;
use Modules\Asset\Http\Requests\AddAssetRequest;
use Modules\Asset\Http\Services\AssetLogService;
use Modules\Asset\Http\Services\AssetService;
use App\Http\Controllers\Controller;
use Modules\Asset\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    protected $assetService;
    protected $assetTypeService;
    protected $assetLogService;

    public function __construct(AssetService $assetService, AssetLogService $assetLogService, AssetTypeService $assetTypeService)
    {
        $this->assetService = $assetService;
        $this->assetLogService = $assetLogService;
        $this->assetTypeService = $assetTypeService;
    }

    public function assetIndex(Request $request)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['view'])) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        if (checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            $asset = $this->assetService->getAllAssetPagination($request, $perPage);
        } else {
            $asset = $this->assetService->getAssetPagination($request, $perPage);
        }

        return Inertia::render('Asset/AssetsIndex', [
            'assets' => $asset,
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
                'brand' => $request->brand,
                'condition' => $request->condition,
                'availability' => $request->availability,
            ],
            'filterValues' => $this->assetService->getAllAssetFilters(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function destroy($asset)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        $asset = $this->assetService->findAsset($asset);

        $asset->deleted_by = auth()->id();

        $asset->save();

        $asset->delete();

        $this->assetLogService->userDeleteAsset($asset);

        return redirect()->route('assets.index')->with('success', 'Asset Deleted Successfully');
    }

    public function showAssetDetails($asset)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['view'])) {
            return redirect()->route('dashboard.index');
        }

        if (!checkAuthority(config('asset.permissions')['permissions']['audit'])) {
            return Inertia::render('Asset/AssetsDetails', [
                'asset' => $this->assetService->findAssetWithDetails($asset),
                'permissions' => auth()->user()->getTenantPermission(),
                'log' => null,
            ]);
        }

        return Inertia::render('Asset/AssetsDetails', [
            'asset' => $this->assetService->findAssetWithDetails($asset),
            'permissions' => auth()->user()->getTenantPermission(),
            'log' => $this->assetLogService->getAssetLogs($this->assetService->findAsset($asset)),
        ]);
    }

    public function showAssetAdd()
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('Asset/AssetsAdd', [
            'assetTypes' => $this->assetTypeService->getAllAssetTypes(),
            'brands' => $this->assetService->getAllAssetBrands(),
        ]);
    }

    public function storeAssets(AddAssetRequest $request)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validated();

        $assetType = $this->assetTypeService->findAssetType($validated['asset_type_id']);

        $asset = $this->assetService->createAsset($validated, $assetType);

        $this->assetLogService->userAddAsset($asset);

        return redirect()->route('assets.index')->with('success', 'Assets Added Successfully.');
    }

    public function showAssetEdit($asset)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('Asset/AssetsEdit', [
            'asset' => $this->assetService->findAsset($asset),
            'assetTypes' => $this->assetTypeService->getAllAssetTypes(),
            'brands' => $this->assetService->getAllAssetBrands(),
        ]);
    }

    public function assetUpdate(UpdateAssetRequest $request, Asset $asset)
    {
        $validated = $request->validated();

        $asset->update($validated);

        $this->assetLogService->userEditAsset($asset);

        return redirect()->route('assets.index')->with('success', 'Asset Updated Sucessfully');
    }

    public function getAssets($assetType, Request $request)
    {
        return response()->json($this->assetService->getAvailableAssetsByAssetType($assetType, $request->loan_id));
    }
}