<?php

namespace Modules\Loans\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Items\Models\Unit;
// use Modules\Items\Database\Factories\LoanFactory;

class loan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['name', 'description'];

    public function unit(): BelongsToMany
    {
        return $this->belongsToMany(Unit::class)
            ->withPivot('date_of_return', 'due_date')
            ->withTimestamps();
    }

    protected static function booted()
    {
        // insert tenant when creating
        static::creating(function ($item) {
            if (!$item->tenant_id && tenant()) {
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
