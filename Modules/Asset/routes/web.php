<?php

use Illuminate\Support\Facades\Route;
use Modules\Asset\Http\Controllers\AssetController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assets')->name('assets.')->group(function () {

    Route::get('/', [AssetController::class, 'index'])->name('index');

    Route::post('/add', [AssetController::class, 'store'])->name('store');

    Route::get('/edit/{assetType}', [AssetController::class, 'showEditForm'])->name('edit');
    Route::put('/edit/{assetType}', [AssetController::class, 'update'])->name('update');

    Route::delete('/{id}', [AssetController::class, 'destroy'])->name('destroy');

    Route::get('/add', [AssetController::class, 'showAssetAdd'])->name('asset.add');
    Route::post('/add/assets', [AssetController::class, 'storeAssets'])->name('asset.add');

    Route::get('/{assetType}', [AssetController::class, 'asset'])->name('asset.index');

    Route::get('/edit/assets/{asset}', [AssetController::class, 'showAssetEdit'])->name('asset.edit');
    Route::put('/edit/assets/{asset}', [AssetController::class, 'AssetUpdate'])->name('asset.update');

    Route::get('/api/{assetType}/assets', [AssetController::class, 'getAssets'])->name('asset.api');
    Route::get('/{asset}/details', [AssetController::class, 'showAssetDetails'])->name('asset.details');
});
