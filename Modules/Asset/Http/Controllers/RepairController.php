<?php

namespace Modules\Asset\Http\Controllers;

use Modules\Asset\Http\Requests\AddRepairRequest;
use Modules\Asset\Http\Requests\UpdateRepairRequest;
use Modules\Asset\Http\Services\AssetTypeService;
use Modules\Asset\Http\Services\RepairService;
use Modules\Asset\Http\Services\AssetService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Asset\Models\Repair;

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
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        $repairs = $this->repairService->getAllRepairsPaginated($request, $perPage);

        return Inertia::render('Asset/RepairIndex', [
            'repairs' => $repairs,
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function details($repair)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        return Inertia::render('Asset/RepairDetails', [
            'repair' => $this->repairService->getRepair($repair),
        ]);

    }

    public function showRepairAdd()
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        return Inertia::render('Asset/RepairAdd', [
            'assetTypes' => $this->assetTypeService->getAllAssetTypes(),
        ]);
    }

    public function store(AddRepairRequest $request)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        $validated = $request->validated();

        $this->repairService->createRepair($validated);

        return redirect()->route('repairs.index');
    }

    public function showRepairEdit($repair)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        return Inertia::render('Asset/RepairEdit', [
            'repair' => $this->repairService->getRepair($repair),
        ]);
    }

    public function update(UpdateRepairRequest $request, Repair $repair)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        $validated = $request->validated();

        $this->repairService->updateRepair($validated, $repair);

        return redirect()->route('repairs.index');
    }

    public function cancel($repair)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        $this->repairService->cancelRepair($repair);
    }

    public function complete($repair)
    {
        if (!checkAuthority(config('asset.permissions')['permissions']['repair'])) {
            return redirect()->route('dashboard.index');
        }
        $this->repairService->completedRepair($repair);
    }

    public function destroy()
    {

    }


}
