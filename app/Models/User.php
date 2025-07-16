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

    public function usersFromSameTenant($perPage = 10)
    {
        $tenantId = session('active_tenant_id');

        return self::whereHas('tenants', function ($query) use ($tenantId) {
            $query->where('tenant_id', $tenantId);
        })->paginate($perPage);
    }

    public function getTenantPermission()
    {

        $user = auth()->user();

        $tenantId = session('active_tenant_id');

        $assignedPermissions = DB::table('users as u')
            ->join('model_has_roles as mhr', function ($join) use ($user) {
                $join->on('u.id', '=', 'mhr.model_id')
                    ->where('mhr.model_id', '=', $user->id);
            })
            ->join('role_has_permissions as rhp', function ($join) use ($tenantId) {
                $join->on('mhr.role_id', '=', 'rhp.role_id')
                    ->where('rhp.tenant_id', '=', $tenantId);
            })
            ->join('permissions as p', 'rhp.permission_id', '=', 'p.id')
            ->where('u.id', $user->id)
            ->select('p.*')
            ->distinct()
            ->pluck('p.name')
            ->toArray();

            return $assignedPermissions;
    }

    public function tenants()
    {
        return $this->belongsToMany(Tenant::class, 'tenant_user', 'user_id', 'tenant_id')->withTimestamps();
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
