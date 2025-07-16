<?php

use Illuminate\Support\Facades\Route;
use Modules\Profile\Http\Controllers\ProfileController;


Route::middleware(['auth', 'tenant'])->group(function () {
    Route::get('/dashboard/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::get('/dashboard/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/dashboard/profile', [ProfileController::class, 'update'])->name('profile.update');
});