<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/switch/{tenantId}', [AuthController::class, 'switchTenant'])->middleware('auth');

Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard.index');
    Route::get('/dashboard/tenant', [DashboardController::class, 'showTenant'])->name('tenant.index');
    Route::get('/dashboard/tenant/edit', [DashboardController::class, 'editTenant'])->name('tenant.edit');
    Route::post('/dashboard/tenant', [DashboardController::class, 'updateTenant'])->name('tenant.update');
});