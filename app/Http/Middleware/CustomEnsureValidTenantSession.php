<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Multitenancy\Models\Tenant;

class CustomEnsureValidTenantSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $sessionTenantId = session('active_tenant_id');
        $currentTenant = Tenant::current();

        if ($sessionTenantId && $currentTenant && $sessionTenantId != $currentTenant->id) {
            session(['ensure_valid_tenant_session_tenant_id' => $currentTenant->id]);
        }

        return $next($request);
    }
}
