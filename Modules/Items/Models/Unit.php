<?php

namespace Modules\Items\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Loans\Models\Loan;
// use Modules\Items\Database\Factories\UnitFactory;

class Unit extends Model
{
    use HasFactory;
    protected $fillable = ['item_id', 'unit_code', 'available'];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function loans(): BelongsToMany
    {
        return $this->belongsToMany(Loan::class)
            ->withPivot('date_of_return', 'due_date')
            ->withTimestamps();
    }

    protected static function booted()
    {
        // insert tenant when creating
        static::creating(function ($item) {
            if (! $item->tenant_id && tenant()) {
                $item->tenant_id = tenant()->id;
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
