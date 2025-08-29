<?php

namespace Modules\Asset\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Modules\Asset\Models\Asset;

class AssetExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        $asset = Asset::select('serial_code', 'brand', 'condition', 'availability', 'created_at')->get();

        return Asset::select('serial_code', 'brand', 'condition', 'availability', 'created_at')->get();
    }

    public function headings(): array
    {
        return [
            'Serial Code',
            'Brand',
            'Condition',
            'Availability',
            'Created At',
        ];
    }
}
