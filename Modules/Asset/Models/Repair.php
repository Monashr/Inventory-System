<?php

namespace Modules\Asset\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Repair extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['asset_id', 'tenant_id', 'repair_start_date', 'repair_completion_date', 'defect_description', 'corrective_action', 'repair_cost', 'vendor', 'status', 'created_by', 'updated_by', 'deleted_by'];

    public function  asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class)->withTrashed();
    }

    protected static function booted()
    {
        // insert tenant when creating
        static::creating(function ($assetType) {
            if (!$assetType->tenant_id && tenant()) {
                $assetType->tenant_id = tenant()->id;
            }
        });

        // adding scope to tenant when query
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (tenant()) {
                $builder->where('tenant_id', tenant()->id);
            }
        });
    }
}
