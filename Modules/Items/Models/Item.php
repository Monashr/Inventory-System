<?php

namespace Modules\Items\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Items\Database\Factories\ItemFactory;

class Item extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'price',
        'stock',
    ];

    // protected static function newFactory(): ItemFactory
    // {
    //     // return ItemFactory::new();
    // }
}