<?php

namespace Modules\Asset\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use App\Models\User;

class AssetLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['asset_id', 'tenant_id', 'activity_type', 'activity_date', 'activity_description', 'created_by', 'updated_by', 'deleted_by'];

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
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
