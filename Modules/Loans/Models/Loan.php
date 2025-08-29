<?php

namespace Modules\Loans\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Asset\Models\Asset;

// use Modules\Items\Database\Factories\LoanFactory;

class Loan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = ['user_id', 'name', 'description', 'status', 'evident', 'document'];

    public function assets(): BelongsToMany
    {
        return $this->belongsToMany(Asset::class)
            ->withPivot('loaned_date', 'return_date', 'loaned_condition', 'return_condition', 'loaned_status')
            ->with('assetType')
            ->withTrashed()
            ->withTimestamps();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
