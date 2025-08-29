<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Nwidart\Modules\Facades\Module;

class MenuServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Inertia::share([
            // Authenticated user's tenant info
            'tenants' => fn () => auth()->check()
                ? auth()->user()->tenants()->select('tenants.id', 'tenants.name', 'tenants.pictures')->get()
                : [],
            'currentTenantId' => fn () => session('active_tenant_id'),
            'user' => fn () => auth()->user(),
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },

            // Dynamic module menus
            'moduleMenus' => function () {
                $user = auth()->user();
                $menus = collect();

                foreach (Module::allEnabled() as $module) {
                    $path = $module->getPath().'/config/menu.php';

                    if (file_exists($path)) {
                        $configMenus = require $path;

                        foreach ($configMenus as $menu) {
                            if (! isset($menu['permission']) || ($user && checkAuthority($menu['permission']))) {
                                $menus->push($menu);
                            }
                        }
                    }
                }

                return $menus->values();
            },
        ]);
    }
}
