<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\Location;
use Modules\Asset\Models\Repair;
use Carbon\Carbon;

class RepairService
{
    protected $assetLogService;
    protected $assetService;
    protected $locationService;

    public function __construct(AssetLogService $assetLogService, AssetService $assetService, LocationService $locationService)
    {
        $this->assetLogService = $assetLogService;
        $this->assetService = $assetService;
        $this->locationService = $locationService;
    }

    public function getAllRepairsPaginated($request, $perPage)
    {
        $query = Repair::withoutGlobalScope('tenant')
            ->select('repairs.*', 'assets.serial_code as asset_name')
            ->join('assets', 'repairs.asset_id', '=', 'assets.id')
            ->where('repairs.tenant_id', tenant()->id);

        if ($request->filled('vendor')) {
            $query->where('vendor', 'LIKE', '%' . $request->vendor . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $allowedSorts = ['asset_name', 'repair_start_date', 'repair_completion_date', 'repair_cost', 'vendor', 'status'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'asset_name';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);

            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(vendor) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(status) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(corrective_action) LIKE ?', ["%{$search}%"])
                    ->orWhereHas('asset', function ($q2) use ($search) {
                        $q2->whereRaw('LOWER(serial_code) LIKE ?', ["%{$search}%"])
                            ->orWhereRaw('LOWER(brand) LIKE ?', ["%{$search}%"]);
                    });
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getRepair($repair)
    {
        return Repair::with(['asset'])->find($repair);
    }

    public function createRepair($validated)
    {
        $user_id = auth()->user()->id;

        $location = $this->locationService->getLocationByVendor($validated['vendor'], $validated['vendor_address']);

        $asset = $this->assetService->findAsset($validated['asset_id']);

        $asset->update(['availability' => 'repair', 'location_id' => $location->id]);

        $repair = Repair::create([
            'asset_id' => $validated['asset_id'],
            'tenant_id' => auth()->user()->tenant_id,
            'repair_start_date' => $validated['repair_start_date'],
            'defect_description' => $validated['defect_description'],
            'corrective_action' => $validated['corrective_action'],
            'repair_cost' => $validated['repair_cost'],
            'vendor' => $validated['vendor'],
            'status' => "progress",
            'location_id' => $location->id,

            'created_by' => $user_id,
            'updated_by' => $user_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->assetLogService->userRepairAsset($asset);

        return $repair;
    }

    public function updateRepair($request, $repair)
    {
        $repair->update($request);
        $repair->update(['updated_by' => auth()->user()->id]);
        $repair->save();

        $this->assetLogService->userEditRepair($repair->asset);
    }

    public function cancelRepair($repair)
    {
        $repair = $this->getRepair($repair);

        $repair->update(['status' => 'cancelled', 'updated_by' => auth()->user()->id]);

        if ($repair->asset) {
            $repair->asset->update(['availability' => 'available', 'updated_by' => auth()->user()->id, 'location_id' => $this->locationService->getOrCreateDefaultLocation()->id,]);
        }

        $repair->save();

        $this->assetLogService->userCancelRepairAsset($repair->asset);
    }

    public function completedRepair($repair)
    {
        $repair = $this->getRepair($repair);

        $repair->update([
            'repair_completion_date' => Carbon::now(),
            'status' => 'completed',
            'updated_by' => auth()->user()->id,
        ]);

        if ($repair->asset) {
            $repair->asset->update([
                'availability' => 'available',
                'condition' => 'good',
                'updated_by' => auth()->user()->id,
                'location_id' => $this->locationService->getOrCreateDefaultLocation()->id,
            ]);
        }

        $repair->save();

        $this->assetLogService->userCompleteRepairAsset($repair->asset);
    }

    public function getAllVendorDistinct()
    {
        return $this->locationService->getAllLocationNoDefaultDistinc();
    }

    public function getAllVendor()
    {
        return $this->locationService->getAllLocationNoDefault();
    }

    public function getAllStatus()
    {
        return Repair::select('status')
            ->distinct()
            ->whereNotNull('status')
            ->where('status', '!=', '')
            ->orderBy('status')
            ->get()
            ->pluck('status');
    }

    public function getAllRepairFilters()
    {
        return [
            'vendor' => $this->getAllVendorDistinct(),
            'status' => $this->getAllStatus(),
        ];
    }
}