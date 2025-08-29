<?php

namespace Modules\Asset\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssetType extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['name', 'model', 'code', 'created_by', 'updated_by', 'deleted_by'];

    protected $table = 'asset_types';

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    protected static function booted()
    {
        // insert tenant when creating
        static::creating(function ($assetType) {
            if (! $assetType->tenant_id && tenant()) {
                $assetType->tenant_id = tenant()->id;
            }
        });

        // adding scope to tenant when query
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (tenant()) {
                $builder->where('tenant_id', tenant()->id);
            }
        });

        static::deleting(function ($assetType) {
            if ($assetType->isForceDeleting()) {
                $assetType->assets()->forceDelete();
            } else {
                $assetType->assets()->delete();
            }
        });
    }
}
