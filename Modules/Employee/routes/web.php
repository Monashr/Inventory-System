<?php

use Illuminate\Support\Facades\Route;
use Modules\Employee\Http\Controllers\EmployeeController;
use Modules\Employee\Http\Controllers\MailController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/employees')->name('employees.')->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])->name('index');

    Route::get('/permission/{id}', [EmployeeController::class, 'showPermission'])->name('permission');
    Route::get('/permissions/{id}', [EmployeeController::class, 'showAddPermissionForm'])->name('permission.edit');
    Route::post('/permissions/{id}', [EmployeeController::class, 'assignPermissions'])->name('permission.assign');

    Route::get('/create', [EmployeeController::class, 'showCreateEmployeeForm'])->name('createEmployee');
    Route::post('/create', [EmployeeController::class, 'storeEmployee'])->name('storeEmployee');

    Route::post('/revoke/{id}', [EmployeeController::class, 'revokeAllPermissions'])->name('permission.revoke');
    Route::post('/delete/{id}', [EmployeeController::class, 'deleteUserFromTenant'])->name('deleteEmployee');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/inbox')->name('inbox.')->group(function () {
    Route::get('/', [MailController::class, 'showInbox'])->name('index');
    Route::post('/add', [MailController::class, 'inviteByEmail'])->name('store');
    Route::post('/accept/{id}', [MailController::class, 'acceptInvitation'])->name('accept');
    Route::delete('/decline/{id}', [MailController::class, 'declineInvitation'])->name('decline');
    Route::get('/detail/{id}', [MailController::class, 'mailDetails'])->name('detail');
});
