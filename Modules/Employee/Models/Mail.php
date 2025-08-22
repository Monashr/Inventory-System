<?php

namespace Modules\Employee\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Tenant;

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
