<?php

namespace App\Http\Services;

use App\Models\Position;

class PositionService
{
    public function createPosition(string $name, $tenant_id)
    {
        $position = Position::create([
            'name' => $name,
            'tenant_id' => $tenant_id,
        ]);

        return $position;
    }
}
