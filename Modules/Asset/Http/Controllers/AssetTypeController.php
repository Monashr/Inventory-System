<?php

namespace Modules\Asset\Http\Controllers;

use Modules\Asset\Http\Requests\UpdateAssetTypeRequest;
use Modules\Asset\Http\Requests\AddAssetTypeRequest;
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
        if (!checkAuthority(config('asset.permissions')['permissions']['view'])) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        return Inertia::render('Asset/AssetTypesIndex', [
            'assetTypes' => $this->assetTypeService->getAssetTypePagination($request, $perPage),
            'permissions' => auth()->user()->getTenantPermission(),
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
                'name' => $request->name,
                'model' => $request->model,
            ],
            'filterValues' => $this->assetTypeService->getAllAssetTypeFilters(),
        ]);
    }

    public function showAssetTypeAddForm()
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['view'])) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('Asset/AssetTypesAdd', [
            'models' => $this->assetTypeService->getAllAssetTypeModels(),
        ]);
    }

    public function assetTypeDetails(Request $request, $assetType)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['view'])) {
            return redirect()->route('dashboard.index');
        }
        
        $perPage = $request->input('per_page', 10);

        return Inertia::render('Asset/AssetTypesDetails', [
            'assets' => $this->assetService->getPaginatedAssetsByAssetType($request, $assetType, $perPage),
            'assetType' => $this->assetTypeService->findAssetType($assetType),
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
            'permissions' => auth()->user()->getTenantPermission(),
            'totalAvailableAssets' => $this->assetService->getTotalAvailableAssets($assetType),
            'totalLoanedAssets' => $this->assetService->getTotalLoanedAssets($assetType),
            'totalDefectAssets' => $this->assetService->getTotalDefectAssets($assetType),
        ]);
    }

    public function storeAssetType(AddAssetTypeRequest $request)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validated();

        $assetType = $this->assetTypeService->createAssetType($validated);

        return redirect()->route('assettypes.index')->with('success', 'Asset Type ' . $assetType->name . ' created successfully');
    }

    public function showAssetTypeEditForm(AssetType $assetType)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render("Asset/AssetTypesEdit", [
            "assetType" => $assetType,
        ]);
    }

    public function updateAssetType(UpdateAssetTypeRequest $request, AssetType $assetType)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validated();

        $assetType->update($validated);

        return redirect()->route('assettypes.index')->with('success', 'Asset Type ' . $assetType->name . ' updated successfully');
        ;
    }

    public function destroy($assetType)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['manage'])) {
            return redirect()->route('dashboard.index');
        }

        $assetType = $this->assetTypeService->findAssetType($assetType);

        $assetType->deleted_by = auth()->id();

        $assetType->save();

        $assetType->delete();

        return redirect()->route('assettypes.index')->with('success', 'Asset Type ' . $assetType->name . ' deleted successfully');
        ;
    }

}
