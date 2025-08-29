<?php

namespace App\Imports;

use App\Models\Tenant;
use Maatwebsite\Excel\Concerns\ToModel;
use Modules\Asset\Models\Asset;
use Modules\Asset\Models\AssetType;

class AssetImport implements ToModel
{
    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $assetType = AssetType::where('name', $row['asset_type'])->first();
        $tenant = Tenant::where('name', $row['tenant'])->first();

        if (! $assetType || ! $tenant) {
            return null;
        }

        return new Asset([
            'asset_type_id' => $assetType->id,
            'tenant_id' => $tenant->id,
            'serial_code' => $row['serial_code'],
            'brand' => $row['brand'],
            'specification' => $row['specification'],
            'purchase_date' => $row['purchase_date'],
            'purchase_price' => $row['purchase_price'],
            'initial_condition' => $row['initial_condition'],
            'condition' => $row['condition'],
            'avaibility' => $row['avaibility'],
        ]);
    }
}
