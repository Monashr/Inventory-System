<?php

namespace Modules\Asset\Http\Controllers;

use Modules\Asset\Http\Requests\Asset\UpdateAssetRequest;
use Modules\Asset\Http\Requests\Asset\AddAssetRequest;
use Modules\Asset\Http\Services\AssetTypeService;
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
        return Inertia::render('Asset/AssetsIndex', [
            'assets' => $this->assetService->getAllAssetPagination($request),
            'filters' => $this->assetService->getAllAssetFilter($request),
            'filterValues' => $this->assetService->getAllAssetFilterValues(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function destroy($asset)
    {
        if ($this->assetService->deleteAsset($asset)) {
            return redirect()->route('assets.index')->with('success', 'Asset Deleted Successfully');
        }

        return redirect()->route('assets.index')->with('error', 'Asset currently in repair cannot delete');
    }

    public function showAssetDetails(Request $request, $asset)
    {
        if (!$this->assetService->canAuditAsset()) {
            return Inertia::render('Asset/AssetsDetails', [
                'asset' => $this->assetService->findAssetWithDetails($asset),
                'permissions' => auth()->user()->getTenantPermission(),
                'filters' => null,
                'filterValues' => null,
                'log' => null,
            ]);
        }

        return Inertia::render('Asset/AssetsDetails', [
            'asset' => $this->assetService->findAssetWithDetails($asset),
            'permissions' => auth()->user()->getTenantPermission(),
            'filters' => $this->assetLogService->getAllAssetLogFilters($request),
            'filterValues' => $this->assetLogService->getAllAssetLogFilterValues($asset),
            'log' => $this->assetLogService->getAssetLogs($this->assetService->findAsset($asset), $request),
        ]);
    }

    public function showAssetAdd()
    {
        return Inertia::render('Asset/AssetsAdd', [
            'assetTypes' => $this->assetTypeService->getAllAssetTypes(),
            'brands' => $this->assetService->getAllAssetBrandsNoAll(),
        ]);
    }

    public function storeAssets(AddAssetRequest $request)
    {
        $this->assetService->storeAsset($request);

        return redirect()->route('assets.index')->with('success', 'Assets Added Successfully.');
    }

    public function showAssetEdit($asset)
    {
        return Inertia::render('Asset/AssetsEdit', [
            'asset' => $this->assetService->findAsset($asset),
            'assetTypes' => $this->assetTypeService->getAllAssetTypes(),
            'brands' => $this->assetService->getAllAssetBrands(),
        ]);
    }

    public function assetUpdate(UpdateAssetRequest $request, Asset $asset)
    {
        $this->assetService->updateAsset($request, $asset);

        return redirect()->route('assets.index')->with('success', 'Asset Updated Sucessfully');
    }

    public function getAssets($assetType, Request $request)
    {
        return response()->json($this->assetService->getAvailableAssetsByAssetType($assetType, $request->loan_id));
    }
}