<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthorityCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module, ...$permissions): Response
    {
        foreach ($permissions as $permission) {
            if (checkAuthority(config($module.'.permissions')['permissions'][$permission] ?? null)) {
                return $next($request);
            }
        }

        return redirect()->route('dashboard.index');
    }
}
