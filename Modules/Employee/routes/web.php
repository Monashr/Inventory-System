<?php

use Illuminate\Support\Facades\Route;
use Modules\Employee\Http\Controllers\EmployeeController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/employees')->name('employees.')->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])->name('index');
    Route::post('/add', [EmployeeController::class, 'store'])->name('store');

    Route::get('/inbox', [EmployeeController::class, 'showInbox'])->name('inbox');
    Route::post('/inbox/accept/{id}', [EmployeeController::class, 'acceptInvitation'])->name('accept');
    Route::delete('/inbox/decline/{id}', [EmployeeController::class, 'declineInvitation'])->name('decline');

    Route::get('/permission/{id}', [EmployeeController::class, 'showPermission'])->name('permission');
    Route::get('/permissions/{id}', [EmployeeController::class, 'showAddPermissionForm'])->name('permission.edit');
    Route::post('/permissions/{id}', [EmployeeController::class, 'assignPermissions'])->name('permission.assign');
});