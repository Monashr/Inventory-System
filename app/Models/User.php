<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'tenant_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function tenants()
    {
        return $this->belongsToMany(Tenant::class)->withTimestamps();
    }
    
    public function assignRole($tenantId, ...$roles)
    {
        $roles = collect($roles)->flatten()->map(function ($role) {
            if (is_string($role)) {
                return app(\Spatie\Permission\PermissionRegistrar::class)
                    ->getRoleClass()
                    ->where('name', $role)
                    ->firstOrFail();
            }
            return $role;
        });

        foreach ($roles as $role) {
            $exists = \DB::table('model_has_roles')
                ->where('role_id', $role->id)
                ->where('model_type', get_class($this))
                ->where('model_id', $this->id)
                ->where('tenant_id', $tenantId)
                ->exists();

            if (!$exists) {
                \DB::table('model_has_roles')->insert([
                    'role_id' => $role->id,
                    'model_type' => get_class($this),
                    'model_id' => $this->id,
                    'tenant_id' => $tenantId,
                ]);
            }
        }

        $this->forgetCachedPermissions();

        return $this;
    }
}
