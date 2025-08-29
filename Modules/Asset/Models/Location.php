<?php

namespace Modules\Asset\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'address', 'created_by', 'updated_by', 'deleted_by'];

    public function asset(): HasMany
    {
        return $this->hasMany(AssetType::class);
    }

    public function repairs(): HasMany
    {
        return $this->hasMany(Repair::class);
    }

    protected static function booted()
    {
        // insert tenant when creating
        static::creating(function ($asset) {
            if (! $asset->tenant_id && tenant()) {
                $asset->tenant_id = tenant()->id;
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
