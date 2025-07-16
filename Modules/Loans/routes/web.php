<?php

use Illuminate\Support\Facades\Route;
use Modules\Loans\Http\Controllers\LoansController;

Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/dashboard/loans', [LoansController::class, 'index'])->name('loans.index');
});