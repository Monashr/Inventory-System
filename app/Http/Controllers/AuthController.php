<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Services\AuthService;
use App\Http\Services\TenantService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected $authService;

    protected $tenantService;

    public function __construct(AuthService $authService, TenantService $tenantService)
    {
        $this->authService = $authService;
        $this->tenantService = $tenantService;
    }

    public function showLoginForm()
    {
        $this->authService->redirectToDashboardIfAlreadyAuthenticated();

        return Inertia::render('LoginForm');
    }

    public function showRegisterForm()
    {
        $this->authService->redirectToDashboardIfAlreadyAuthenticated();

        return Inertia::render('RegisterForm');
    }

    public function login(LoginRequest $request)
    {
        $this->authService->redirectToDashboardIfAlreadyAuthenticated();

        $credentials = $request->validated();

        if ($this->authService->login($credentials, $request)) {
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials are incorrect.',
        ])->onlyInput('email');
    }

    public function register(RegisterRequest $request)
    {
        $this->authService->redirectToDashboardIfAlreadyAuthenticated();

        $user = $this->authService->register($request);

        auth()->login($user);

        return redirect()->intended('/dashboard');
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request);

        return redirect('/login');
    }

    public function switchTenant($tenantId)
    {
        $user = auth()->user();

        if ($this->tenantService->checkIfUserInTenant($user, $tenantId)) {
            $this->tenantService->changeUserActiveTenantSession($tenantId);

            return redirect()->back()->with('success', 'Tenant switched.');
        }

        abort(403, 'Unauthorized tenant, from auth');
    }
}
