<?php

namespace App\Imports;

use Modules\Asset\Models\Asset;
use Maatwebsite\Excel\Concerns\ToModel;

class AssetImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {

        dd($row);
        // Resolve foreign keys
        $assetType = AssetType::where('name', $row['asset_type'])->first();
        $tenant = Tenant::where('name', $row['tenant'])->first();

        // Optionally validate
        if (!$assetType || !$tenant) {
            // Skip row or handle error
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
