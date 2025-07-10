<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Modules\Items\Http\Controllers\ItemsController;

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard/items', [ItemsController::class, 'index'])->name('items.index');

    Route::get('/dashboard/items/add', [ItemsController::class, 'showAddForm'])->name('items.add');
    Route::post('/dashboard/items/add', [ItemsController::class, 'store'])->name('items.store');

    Route::get('/dashboard/items/edit/{item}', [ItemsController::class, 'showEditForm'])->name('items.edit');
    Route::put('/dashboard/items/edit/{item}', [ItemsController::class, 'update'])->name('items.update');

    Route::delete('/dashboard/items/{id}', [ItemsController::class, 'destroy'])->name('items.destroy');

});
