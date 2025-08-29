<?php

namespace Modules\Employee\Models;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mail extends Model
{
    use HasFactory;

    protected $table = 'mails';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
        'tenant_id',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
