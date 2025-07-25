<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\AssetType;
use Modules\Asset\Models\Repair;
use Modules\Asset\Models\Asset;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Carbon\Carbon;

class RepairService
{
    protected $assetLogService;

    public function __construct(AssetLogService $assetLogService)
    {
        $this->assetLogService = $assetLogService;
    }

    public function getAllRepairsPaginated($request, $perPage)
    {
        $query = Repair::withoutGlobalScope('tenant')
            ->with('asset')
            ->select('repairs.*')
            ->where('repairs.tenant_id', tenant()->id);

        $sortBy = $request->get('sort_by', 'repair_cost');
        $sortDirection = $request->get('sort_direction', 'asc');

        if ($sortBy === 'asset_name') {
            $query->join('assets', 'repairs.asset_id', '=', 'assets.id')
                ->orderBy('assets.serial_code', $sortDirection)
                ->select('repairs.*');
        } else {
            $query->orderBy("repairs.{$sortBy}", $sortDirection);
        }

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

        $asset = $this->getAsset($validated['asset_id']);

        $asset->update(['avaibility' => 'repair']);

        $repair = Repair::create([
            'asset_id' => $validated['asset_id'],
            'tenant_id' => auth()->user()->tenant_id,
            'repair_start_date' => $validated['repair_start_date'],
            'defect_description' => $validated['defect_description'],
            'corrective_action' => $validated['corrective_action'],
            'repair_cost' => $validated['repair_cost'],
            'vendor' => $validated['vendor'],
            'status' => "progress",

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
            $repair->asset->update(['avaibility' => 'available', 'updated_by' => auth()->user()->id]);
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
                'avaibility' => 'available',
                'condition' => 'good',
                'updated_by' => auth()->user()->id,
            ]);
        }

        $repair->save();

        $this->assetLogService->userCompleteRepairAsset($repair->asset);
    }

    private function getAsset($asset)
    {
        return Asset::findOrFail($asset);
    }


}