<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
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
            $tenantId = auth()->user()->tenant_id;

            if ($tenantId) {
                $tenant = Tenant::find($tenantId);

                if ($tenant) {
                    $tenant->makeCurrent();
                }
            }
        }

        return $next($request);
    }
}
