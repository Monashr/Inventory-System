<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Tenant as Base;

class Tenant extends Base
{
    protected $fillable = [
        'name',
        'domain',
        'database',
        'email',
        'phone',
        'address',
        'industry',
        'website',
        'description',
        'pictures',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
