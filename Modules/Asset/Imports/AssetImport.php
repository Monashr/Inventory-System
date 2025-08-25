<?php

namespace Modules\Asset\Imports;

use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Modules\Asset\Http\Services\AssetLogService;
use Modules\Asset\Http\Services\AssetTypeService;
use Modules\Asset\Http\Services\LocationService;
use Modules\Asset\Models\Asset;
use Maatwebsite\Excel\Concerns\ToModel;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;
use Exception;

use Modules\Asset\Models\AssetType;

class AssetImport implements ToModel, WithHeadingRow
{
    protected $assetLogService;
    protected $locationService;
    protected $assetTypeService;

    public function __construct()
    {
        $this->assetLogService = new AssetLogService();
        $this->locationService = new LocationService();
        $this->assetTypeService = new AssetTypeService($this->assetLogService);
    }

    public function model(array $row)
    {
        $tenant = tenant()->id;

        $name = trim($row['asset_type']);

        $code = $this->assetTypeService->extractBeforeVowel($name);

        $assetType = AssetType::firstOrCreate(
            ['name' => $name],
            [
                'model' => "nothing",
                'code' => $code,
                'created_by' => auth()->user()->id,
                'updated_by' => auth()->user()->id,
            ]
        );

        $serial_code = $this->assetTypeService->generateSerialFromType($code);

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

        $asset = new Asset([
            'asset_type_id' => $assetType->id,
            'tenant_id' => $tenant,
            'serial_code' => $this->assetTypeService->generateSerialFromType($code),
            'brand' => $row['brand'],
            'specification' => $row['specification'],
            'purchase_date' => $purchaseDate,
            'purchase_price' => $row['purchase_price'],
            'initial_condition' => $row['initial_condition'],
            'condition' => $row['condition'],
            'avaibility' => 'available',
            'location_id' => $this->locationService->getOrCreateDefaultLocation()->id,
        ]);

        $asset->save();

        $this->assetLogService->userAddAssetByImport($asset);

        return $asset;
    }
}
