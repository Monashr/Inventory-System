<?php

namespace Modules\Asset\Imports;

use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Modules\Asset\Models\Asset;
use Maatwebsite\Excel\Concerns\ToModel;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;
use Exception;

use Modules\Asset\Models\AssetType;

class AssetImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $tenant = tenant()->id;

        $name = trim($row['asset_type']);

        $assetType = AssetType::firstOrCreate(
            ['name' => $name],
            [
                'model' => "nothing",
                'created_by' => auth()->user()->id,
                'updated_by' => auth()->user()->id,
            ]
        );

        $serial_code = $this->generateSerialCode($assetType->name);

        $purchaseDate = $row['purchase_date'];

        if (is_numeric($purchaseDate)) {
            $purchaseDate = Date::excelToDateTimeObject($purchaseDate)->format('Y-m-d');
        } else {
            try {
                $purchaseDate = Carbon::createFromFormat('d-m-Y', $purchaseDate)->format('Y-m-d');
            } catch (Exception $e) {
                $purchaseDate = null;
            }
        }

        return new Asset([
            'asset_type_id' => $assetType->id,
            'tenant_id' => $tenant,
            'serial_code' => $serial_code,
            'brand' => $row['brand'],
            'specification' => $row['specification'],
            'purchase_date' => $purchaseDate,
            'purchase_price' => $row['purchase_price'],
            'initial_condition' => $row['initial_condition'],
            'condition' => $row['condition'],
            'avaibility' => 'available',
        ]);
    }

    private function generateSerialCode(string $assetTypeName): string
    {
        $slug = strtolower($assetTypeName);
        $slug = preg_replace('/\s+/', '-', $slug);
        $slug = preg_replace('/[^\w\-]/', '', $slug);
        $timestamp = round(microtime(true) * 1000);
        return "{$slug}-{$timestamp}";
    }

}
