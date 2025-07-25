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
    Route::get('/dashboard/loans/concept/concept', [LoansController::class, 'concept'])->name('loans.update');

    Route::post('/dashboard/loans/{loan}/accept', [LoansController::class, 'acceptLoan'])->name('loans.accept');
    Route::post('/dashboard/loans/{loan}/reject', [LoansController::class, 'rejectLoan'])->name('loans.decline');
    Route::post('/dashboard/loans/{loan}/cancel', [LoansController::class, 'cancelLoan'])->name('loans.cancel');

    Route::post('/dashboard/loans/{loan}/return', [LoansController::class, 'returnAsset'])->name('loans.return');
});

