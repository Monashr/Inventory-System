<?php

use Illuminate\Support\Facades\Route;
use Modules\Asset\Http\Controllers\AssetController;
use Modules\Asset\Http\Controllers\AssetImportController;
use Modules\Asset\Http\Controllers\AssetTypeController;
use Modules\Asset\Http\Controllers\RepairController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assets')->name('assets.')->group(function () {

    Route::get('/', [AssetController::class, 'assetIndex'])->name('index');
    Route::get('/{asset}/details', [AssetController::class, 'showAssetDetails'])->name('details');

    Route::get('/add', [AssetController::class, 'showAssetAdd'])->name('add');
    Route::post('/add', [AssetController::class, 'storeAssets'])->name('store');

    Route::get('/{asset}/edit', [AssetController::class, 'showAssetEdit'])->name('edit');
    Route::put('/{asset}/edit', [AssetController::class, 'AssetUpdate'])->name('update');

    Route::delete('/{asset}/delete', [AssetController::class, 'destroy'])->name('delete');

    Route::get('/api/{assetType}/assets', [AssetController::class, 'getAssets'])->name('asset.api');
    Route::post('/import', [AssetImportController::class, 'import'])->name('import');
    Route::get('/template', [AssetImportController::class, 'template'])->name('template');
    Route::get('/export', [AssetImportController::class, 'export'])->name('export');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assettypes')->name('assettypes.')->group(function () {
    Route::get('/', [AssetTypeController::class, 'assetTypeIndex'])->name('index');
    Route::get('/{assetType}/details', [AssetTypeController::class, 'assetTypeDetails'])->name('details');

    Route::get('/add', [AssetTypeController::class, 'showAssetTypeAddForm'])->name('add');
    Route::post('/add', [AssetTypeController::class, 'storeAssetType'])->name('store');

    Route::get('/{assetType}/edit', [AssetTypeController::class, 'showAssetTypeEditForm'])->name('edit');
    Route::put('/{assetType}/edit', [AssetTypeController::class, 'updateAssetType'])->name('update');

    Route::delete('/{assetType}/delete/', [AssetTypeController::class, 'destroy'])->name('delete');
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