<?php

namespace Modules\Asset\Http\Controllers;

use Modules\Asset\Http\Requests\Repair\AddRepairRequest;
use Modules\Asset\Http\Requests\Repair\UpdateRepairRequest;
use Modules\Asset\Http\Services\AssetTypeService;
use Modules\Asset\Http\Services\RepairService;
use Modules\Asset\Http\Services\AssetService;
use App\Http\Controllers\Controller;
use Modules\Asset\Models\Repair;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepairController extends Controller
{
    protected $repairService;
    protected $assetService;
    protected $assetTypeService;

    public function __construct(AssetService $assetService, AssetTypeService $assetTypeService, RepairService $repairService)
    {
        $this->assetService = $assetService;
        $this->assetTypeService = $assetTypeService;
        $this->repairService = $repairService;
    }
    public function index(Request $request)
    {
        return Inertia::render('Asset/RepairIndex', [
            'repairs' => $this->repairService->getAllRepairsPaginated($request),
            'filters' => $this->repairService->getAllRepairFilters($request),
            'filterValues' => $this->repairService->getAllRepairFilterValues(),
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function details($repair)
    {
        return Inertia::render('Asset/RepairDetails', [
            'repair' => $this->repairService->getRepair($repair),
        ]);
    }

    public function showRepairAdd()
    {
        return Inertia::render('Asset/RepairAdd', [
            'assetTypes' => $this->assetTypeService->getAllAssetTypes(),
            'vendors' => $this->repairService->getAllVendor(),
        ]);
    }

    public function store(AddRepairRequest $request)
    {
        $this->repairService->storeRepair($request);

        return redirect()->route('repairs.index');
    }

    public function showRepairEdit($repair)
    {
        return Inertia::render('Asset/RepairEdit', [
            'repair' => $this->repairService->getRepair($repair),
            'vendors' => $this->repairService->getAllVendor(),
        ]);
    }

    public function update(UpdateRepairRequest $request, Repair $repair)
    {
        $this->repairService->updateRepair($request, $repair);

        return redirect()->route('repairs.index');
    }

    public function cancel($repair)
    {
        $this->repairService->cancelRepair($repair);
    }

    public function complete($repair)
    {
        $this->repairService->completedRepair($repair);
    }

    public function destroy()
    {

    }

}
