<?php

use Illuminate\Support\Facades\Route;
use Modules\Employee\Http\Controllers\EmployeeController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/employees')->name('employees.')->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])->name('index');
    Route::post('/add', [EmployeeController::class, 'store'])->name('store');

    Route::get('/permission/{id}', [EmployeeController::class, 'showPermission'])->name('permission');
    Route::get('/permissions/{id}', [EmployeeController::class, 'showAddPermissionForm'])->name('permission.edit');
    Route::post('/permissions/{id}', [EmployeeController::class, 'assignPermissions'])->name('permission.assign');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/inbox')->name('inbox.')->group(function () {
    Route::get('/', [EmployeeController::class, 'showInbox'])->name('index');
    Route::post('/accept/{id}', [EmployeeController::class, 'acceptInvitation'])->name('accept');
    Route::delete('/decline/{id}', [EmployeeController::class, 'declineInvitation'])->name('decline');
});