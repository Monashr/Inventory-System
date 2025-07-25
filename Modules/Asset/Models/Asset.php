<?php

namespace Modules\Asset\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Loans\Models\Loan;
// use Modules\Items\Database\Factories\UnitFactory;

class Asset extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['asset_type_id', 'brand', 'serial_code', 'specification', 'purchase_date', 'purchase_price', 'initial_condition', 'condition', 'avaibility', 'created_by', 'updated_by', 'deleted_by'];

    public function assetType(): BelongsTo
    {
        return $this->belongsTo(AssetType::class);
    }

    public function loans(): BelongsToMany
    {
        return $this->belongsToMany(Loan::class)
            ->withPivot('return_date', 'return_condition', 'loaned_condition', 'created_by', 'updated_by', 'deleted_by', 'deleted_at')
            ->withTimestamps();
    }

    public function repairs(): HasMany
    {
        return $this->hasMany(Repair::class);
    }

    public function logs()
    {
        return $this->hasMany(AssetLog::class);
    }


    protected static function booted()
    {
        // insert tenant when creating
        static::creating(function ($asset) {
            if (!$asset->tenant_id && tenant()) {
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
