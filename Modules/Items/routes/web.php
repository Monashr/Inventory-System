<?php

use Illuminate\Support\Facades\Route;
use Modules\Items\Http\Controllers\ItemsController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/items')->name('items.')->group(function () {

    Route::get('/', [ItemsController::class, 'index'])->name('index');

    Route::get('/add', [ItemsController::class, 'showAddForm'])->name('add');
    Route::post('/add', [ItemsController::class, 'store'])->name('store');

    Route::get('/edit/{item}', [ItemsController::class, 'showEditForm'])->name('edit');
    Route::put('/edit/{item}', [ItemsController::class, 'update'])->name('update');

    Route::delete('/{id}', [ItemsController::class, 'destroy'])->name('destroy');

    Route::get('/{item}/unit', [ItemsController::class, 'unit'])->name('unit.index');
    Route::get('/api/{item}/unit', [ItemsController::class, 'getUnit'])->name('unit.api');
    Route::get('/{unit}/unit/details', [ItemsController::class, 'unitDetails'])->name('unit.details');

});
