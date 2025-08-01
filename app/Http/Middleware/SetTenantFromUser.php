<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;

class SetTenantFromUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $activeTenantId = session('active_tenant_id');


            if (!$activeTenantId) {
                $tenant = auth()->user()->tenants()->first();
                if ($tenant) {
                    session(['active_tenant_id' => $tenant->id]);
                    $activeTenantId = $tenant->id;
                }
            }


            if ($activeTenantId) {
                $user = auth()->user();

                if ($user->tenants()->where('tenants.id', $activeTenantId)->exists()) {
                    $tenant = Tenant::find($activeTenantId);

                } else {
                    $tenant = Tenant::find(auth()->user()->tenants()->first()->id);
                }
                if ($tenant) {
                    $tenant->forgetCurrent();
                    $tenant->makeCurrent();
                }
            }
        }

        return $next($request);
    }

}
