<?php

namespace Modules\Asset\Http\Controllers;

use Modules\Asset\Http\Requests\AssetType\UpdateAssetTypeRequest;
use Modules\Asset\Http\Requests\AssetType\AddAssetTypeRequest;
use Modules\Asset\Http\Services\AssetTypeService;
use Modules\Asset\Http\Services\AssetLogService;
use Modules\Asset\Http\Services\AssetService;
use App\Http\Controllers\Controller;
use Modules\Asset\Models\AssetType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetTypeController extends Controller
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

    public function assetTypeIndex(Request $request)
    {
        return Inertia::render('Asset/AssetTypesIndex', [
            'assetTypes' => $this->assetTypeService->getAssetTypePagination($request),
            'permissions' => auth()->user()->getTenantPermission(),
            'filters' => $this->assetTypeService->getAllAssetTypeFilters($request),
            'filterValues' => $this->assetTypeService->getAllAssetTypeFilterValues(),
        ]);
    }

    public function showAssetTypeAddForm()
    {
        return Inertia::render('Asset/AssetTypesAdd', [
            'models' => $this->assetTypeService->getAllAssetTypeModels(),
        ]);
    }

    public function assetTypeDetails(Request $request, $assetType)
    {
        return Inertia::render('Asset/AssetTypesDetails', [
            'assets' => $this->assetService->getAllAssetPagination($request, $assetType),
            'assetType' => $this->assetTypeService->findAssetType($assetType),
            'filters' => $this->assetTypeService->getAllAssetTypeFilters($request),
            'permissions' => auth()->user()->getTenantPermission(),
            'totalAvailableAssets' => $this->assetService->getTotalAvailableAssets($assetType),
            'totalLoanedAssets' => $this->assetService->getTotalLoanedAssets($assetType),
            'totalDefectAssets' => $this->assetService->getTotalDefectAssets($assetType),
        ]);
    }

    public function storeAssetType(AddAssetTypeRequest $request)
    {
        $this->assetTypeService->storeAssetType($request);

        return redirect()->route('assettypes.index')->with('success', 'Asset Type created successfully');
    }

    public function showAssetTypeEditForm(AssetType $assetType)
    {
        return Inertia::render("Asset/AssetTypesEdit", [
            "assetType" => $assetType,
            "models" => $this->assetTypeService->getAllAssetTypeModels(),
        ]);
    }

    public function updateAssetType(UpdateAssetTypeRequest $request, AssetType $assetType)
    {
        $this->assetTypeService->updateAssetType($request, $assetType);

        return redirect()->route('assettypes.index')->with('success', 'Asset Type updated successfully');
    }

    public function destroy($assetType)
    {
        if ($this->assetTypeService->deleteAssetType($assetType)) {
            return redirect()->route('assettypes.index')->with('success', 'Asset Type deleted successfully');
        }

        return redirect()->route('assettypes.index')->with('error', 'Asset Type cannot be deleted there is assets in repair');
    }

}
