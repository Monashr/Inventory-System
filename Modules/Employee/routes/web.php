<?php

use Illuminate\Support\Facades\Route;
use Modules\Employee\Http\Controllers\EmployeeController;

Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/dashboard/employees', [EmployeeController::class, 'index'])->name('employees.index');

    Route::post('/dashboard/employees/add', [EmployeeController::class, 'store'])->name('employees.store');

    Route::get('/dashboard/employees/inbox', [EmployeeController::class, 'showInbox'])->name('employees.inbox');
    Route::post('/dashboard/employees/inbox/accept/{id}', [EmployeeController::class, 'acceptInvitation'])->name('inbox.accept');

    Route::delete('/dashboard/employee/inbox/decline/{id}', [EmployeeController::class, 'declineInvitation'])->name('inbox.decline');

    Route::get('/dashboard/employees/permission/{id}', [EmployeeController::class, 'showPermission'])->name('employees.permission');

    Route::get('/dashboard/employees/permissions/{id}', [EmployeeController::class, 'showAddPermissionForm'])->name('employees.permission.edit');
    Route::post('/dashboard/employees/permissions/{id}/', [EmployeeController::class, 'assignPermissions'])->name('employees.permission.assign');

});