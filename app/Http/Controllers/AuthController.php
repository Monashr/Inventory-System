<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Tenant;
use App\Models\Role;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Login');
    }

    public function showRegisterForm()
    {
        return Inertia::render('Register');
    }

    public function login(Request $request)
    {
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $tenant = Tenant::create([
            'name' => "$request->name Tenant",
            'domain' => "-",
            'database' => "-",
        ]);

        $tenant->domain = $tenant->id . '-default';
        $tenant->database = $tenant->id . '-default';

        $tenant->save();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tenant_id' => $tenant->id,
        ]);

        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'tenant_id' => $tenant->id,
        ]);

        $user->assignRole($tenant->id, $userRole);

        $user->tenants()->attach($tenant->id);

        $permissions = config('items.permissions');
        $userRole->giveTenantPermissionTo($tenant->id, ...$permissions);

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
}
