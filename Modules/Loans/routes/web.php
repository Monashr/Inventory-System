<?php

use Illuminate\Support\Facades\Route;
use Modules\Loans\Http\Controllers\LoansController;

Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/dashboard/loans', [LoansController::class, 'index'])
        ->name('loans.index')
        ->middleware('AuthorityCheck:loans,own loans,all loans');

    Route::post('/dashboard/loans', [LoansController::class, 'store'])
        ->name('loans.update')
        ->middleware('AuthorityCheck:loans,own loans,all loans');

    Route::get('/dashboard/loans/add', [LoansController::class, 'showAddLoans'])
        ->name('loans.add')
        ->middleware('AuthorityCheck:loans,own loans,all loans');

    Route::get('/dashboard/loans/{loan}', [LoansController::class, 'showLoanDetails'])
        ->name('loans.details')
        ->middleware('AuthorityCheck:loans,own loans,all loans');

    Route::get('/dashboard/loans/{id}/edit', [LoansController::class, 'edit'])
        ->name('loans.edit')
        ->middleware('AuthorityCheck:loans,own loans,all loans');

    Route::put('/dashboard/loans/{id}', [LoansController::class, 'update'])
        ->name('loans.update')
        ->middleware('AuthorityCheck:loans,own loans,all loans');

    Route::post('/dashboard/loans/{loan}/accept', [LoansController::class, 'acceptLoan'])->name('loans.accept');
    Route::post('/dashboard/loans/{loan}/reject', [LoansController::class, 'rejectLoan'])->name('loans.decline');
    Route::post('/dashboard/loans/{loan}/cancel', [LoansController::class, 'cancelLoan'])->name('loans.cancel');

    Route::post('/dashboard/loans/{loan}/return', [LoansController::class, 'returnAsset'])->name('loans.return');

    Route::post('/dashboard/loans/{loan}/evident', [LoansController::class, 'uploadEvident'])->name('loans.evident');
    Route::post('/dashboard/loans/{loan}/document', [LoansController::class, 'uploadDocument'])->name('loans.document');
});

