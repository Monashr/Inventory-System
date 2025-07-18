<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Tenant;
use App\Models\Role;
use Nwidart\Modules\Facades\Module;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        if (auth()->check()) {
            return redirect()->intended('/dashboard');
        }

        return Inertia::render('Login');
    }

    public function showRegisterForm()
    {
        if (auth()->check()) {
            return redirect()->intended('/dashboard');
        }

        return Inertia::render('Register');
    }

    public function login(Request $request)
    {
        if (auth()->check()) {
            return redirect()->intended('/dashboard');
        }

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials are incorrect.',
        ])->onlyInput('email');
    }

    public function register(Request $request)
    {
        if (auth()->check()) {
            return redirect()->intended('/dashboard');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $tenant = Tenant::create([
            'name' => "$request->name Personal Page",
            'domain' => "-",
            'database' => "-",
        ]);

        $tenant->domain = $tenant->id . '-default';
        $tenant->database = $tenant->id . '-default';

        $tenant->save();

        $position = Position::create([
            'name' => 'owner',
            'tenant_id' => $tenant->id,
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->positions()->attach($position);

        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'tenant_id' => $tenant->id,
        ]);

        $user->assignRole($tenant->id, $userRole);

        $user->tenants()->attach($tenant->id);

        $modules = Module::allEnabled();

        foreach ($modules as $module) {
            $moduleName = $module->getLowerName();

            $permissions = config("$moduleName.permissions", []);

            if (!empty($permissions)) {
                $userRole->giveTenantPermissionTo($tenant->id, ...$permissions);
            }
        }

        Auth::login($user);

        return redirect()->intended('/dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    public function switchTenant($tenantId)
    {
        $user = auth()->user();

        if ($user->tenants()->where('tenants.id', $tenantId)->exists()) {
            session(['active_tenant_id' => $tenantId]);

            // dd(session(['active_tenant_id' => $tenantId]));

            return redirect()->back()->with('success', 'Tenant switched.');
        }

        abort(403, "Unauthorized tenant");
    }

}
