<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\AssetLog;
use Modules\Asset\Models\Asset;
use Carbon\Carbon;


class AssetLogService
{
    public function userAddAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'create', $ActivityDescription);
    }

    public function userEditAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'update', $ActivityDescription);
    }

    public function userDeleteAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'delete', $ActivityDescription);
    }
    public function userRepairAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'repair', $ActivityDescription);
    }

    public function userCancelRepairAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'cancel repair', $ActivityDescription);
    }

    public function userCompleteRepairAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'complete repair', $ActivityDescription);
    }

    public function userAddAssetByImport(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'Asset Imported', $ActivityDescription);
    }

    public function getAllAssetLogFilterValues($assetId)
    {
        return [
            'user' => $this->getAllAssetLogUserNames($assetId),
            'activity_type' => $this->getAllAssetLogActivityType($assetId),
        ];
    }

    public function getAllAssetLogUserNames($assetId)
    {
        return AssetLog::where('asset_id', $assetId)
            ->whereNotNull('created_by')
            ->with('user:id,name')
            ->get()
            ->pluck('user.name')
            ->unique()
            ->values();
    }

    public function getAllAssetLogActivityType($assetId)
    {
        return AssetLog::where('asset_id', $assetId)
            ->whereNotNull('created_by')
            ->get()
            ->pluck('activity_type')
            ->unique()
            ->values();
    }

    public function getAssetLogs(Asset $asset, $request)
    {
        $perPage = $request->input('per_page', 10);

        $query = $asset->logs()
            ->select('asset_logs.*', 'users.name as user')
            ->leftJoin('users', 'asset_logs.created_by', '=', 'users.id');

        if ($request->filled('activity_type')) {
            $query->where('activity_type', $request->activity_type);
        }

        if ($request->filled('user')) {
            $query->where('users.name', 'LIKE', '%' . $request->user . '%');
        }

        $allowedSorts = ['user', 'activity_type', 'activity_date'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'activity_date';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage);
    }

    public function userEditRepair(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'edit repair', $ActivityDescription);
    }

    public function userLoanAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'Loaned', $ActivityDescription);
    }

    public function userReturnAsset(Asset $asset, string $ActivityDescription = null)
    {
        $this->createLog($asset, 'Returned', $ActivityDescription);
    }

    private function createLog(Asset $asset, string $activityType, string $ActivityDescription = null)
    {
        AssetLog::create([
            'asset_id' => $asset->id,
            'tenant_id' => session('active_tenant_id'),
            'activity_type' => $activityType,
            'activity_date' => Carbon::now(),
            'activity_description' => $ActivityDescription ?? $this->createDescriptionByTemplate($asset, $activityType),
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }

    private function createDescriptionByTemplate(Asset $asset, string $activityType)
    {
        return auth()->user()->name . " " . $activityType . " on assets id=" . $asset->id . " at " . Carbon::now();
    }

    public function getAllAssetLogFilters($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'user' => $request->user,
            'activity_type' => $request->activity_type,
        ];
    }
}