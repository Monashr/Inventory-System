<?php

use Illuminate\Support\Facades\Route;
use Modules\Asset\Http\Controllers\AssetController;
use Modules\Asset\Http\Controllers\AssetLogController;
use Modules\Asset\Http\Controllers\AssetTypeController;
use Modules\Asset\Http\Controllers\RepairController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assets')->name('assets.')->group(function () {

    Route::get('/', [AssetController::class, 'assetIndex'])->name('index');
    Route::get('/{asset}/details', [AssetController::class, 'showAssetDetails'])->name('details');

    Route::get('/add', [AssetController::class, 'showAssetAdd'])->name('add');
    Route::post('/add', [AssetController::class, 'storeAssets'])->name('store');

    Route::get('/edit/{asset}', [AssetController::class, 'showAssetEdit'])->name('edit');
    Route::put('/edit/{asset}', [AssetController::class, 'AssetUpdate'])->name('update');

    Route::delete('/delete/{asset}', [AssetController::class, 'destroy'])->name('delete');

    Route::get('/api/{assetType}/assets', [AssetController::class, 'getAssets'])->name('asset.api');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assettypes')->name('assettypes.')->group(function () {
    Route::get('/', [AssetTypeController::class, 'assetTypeIndex'])->name('index');
    Route::get('/{assetType}', [AssetTypeController::class, 'assetTypeDetails'])->name('details');

    Route::post('/add', [AssetTypeController::class, 'storeAssetType'])->name('store');

    Route::get('/edit/{assetType}', [AssetTypeController::class, 'showAssetTypeEditForm'])->name('edit');
    Route::put('/edit/{assetType}', [AssetTypeController::class, 'updateAssetType'])->name('update');

    Route::delete('/delete/{assetType}', [AssetTypeController::class, 'destroy'])->name('delete');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/repairs')->name('repairs.')->group(function () {
    Route::get('/', [RepairController::class, 'index'])->name('index');

    Route::get('/{repair}/details', [RepairController::class, 'details'])->name('details');

    Route::get('/add', [RepairController::class, 'showRepairAdd'])->name('add');
    Route::post('/add', [RepairController::class, 'store'])->name('store');

    Route::get('/{repair}/edit', [RepairController::class, 'showRepairEdit'])->name('edit');
    Route::put('/{repair}/update', [RepairController::class, 'update'])->name('update');

    Route::post('/{repair}/cancel', [RepairController::class, 'cancel'])->name('cancel');
    Route::post('/{repair}/complete', [RepairController::class, 'complete'])->name('complete');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assets/logging')->name('log.')->group(function () {
    Route::get('/', [AssetLogController::class, 'index'])->name('index');
});