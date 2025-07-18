<?php

use Illuminate\Support\Facades\Route;
use Modules\Loans\Http\Controllers\LoansController;

Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/dashboard/loans', [LoansController::class, 'index'])->name('loans.index');
    Route::post('/dashboard/loans', [LoansController::class, 'store'])->name('loans.update');
    Route::get('/dashboard/loans/add', [LoansController::class, 'showAddLoans'])->name('loans.add');
    Route::get('/dashboard/loans/{loan}', [LoansController::class, 'showLoanDetails'])->name('loans.details');
    Route::get('/dashboard/loans/{id}/edit', [LoansController::class, 'edit'])->name('loans.edit');
    Route::put('/dashboard/loans/{id}', [LoansController::class, 'update'])->name('loans.update');
});

