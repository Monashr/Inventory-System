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

    public function getAssetLogs(Asset $asset)
    {
        return $asset->logs()->with('user')->paginate(10);
    }

    public function userEditRepair(Asset $asset, string $ActivityDescription = null) {
        $this->createLog($asset, 'edit repair', $ActivityDescription);
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
}