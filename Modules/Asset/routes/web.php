<?php

use Illuminate\Support\Facades\Route;
use Modules\Asset\Http\Controllers\AssetController;
use Modules\Asset\Http\Controllers\AssetImportController;
use Modules\Asset\Http\Controllers\AssetTypeController;
use Modules\Asset\Http\Controllers\RepairController;

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assets')->name('assets.')->group(function () {

    Route::get('/', [AssetController::class, 'assetIndex'])
        ->name('index')
        ->middleware('AuthorityCheck:asset,view');

    Route::get('/{asset}/details', [AssetController::class, 'showAssetDetails'])
        ->name('details')
        ->middleware('AuthorityCheck:asset,view');

    Route::get('/add', [AssetController::class, 'showAssetAdd'])
        ->name('add')
        ->middleware('AuthorityCheck:asset,manage');

    Route::post('/add', [AssetController::class, 'storeAssets'])
        ->name('store')
        ->middleware('AuthorityCheck:asset,manage');

    Route::get('/{asset}/edit', [AssetController::class, 'showAssetEdit'])
        ->name('edit')
        ->middleware('AuthorityCheck:asset,manage');

    Route::put('/{asset}/edit', [AssetController::class, 'AssetUpdate'])
        ->name('update')
        ->middleware('AuthorityCheck:asset,manage');

    Route::delete('/{asset}/delete', [AssetController::class, 'destroy'])
        ->name('delete')
        ->middleware('AuthorityCheck:asset,manage');

    Route::get('/api/{assetType}/assets', [AssetController::class, 'getAssets'])
        ->name('asset.api')
        ->middleware('AuthorityCheck:asset,view');

    Route::post('/import', [AssetImportController::class, 'import'])
        ->name('import')
        ->middleware('AuthorityCheck:asset,manage');

    Route::get('/template', [AssetImportController::class, 'template'])
        ->name('template')
        ->middleware('AuthorityCheck:asset,manage');

    Route::get('/export', [AssetImportController::class, 'export'])
        ->name('export')
        ->middleware('AuthorityCheck:asset,manage');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/assettypes')->name('assettypes.')->group(function () {
    Route::get('/', [AssetTypeController::class, 'assetTypeIndex'])
        ->name('index')
        ->middleware('AuthorityCheck:asset,view');

    Route::get('/{assetType}/details', [AssetTypeController::class, 'assetTypeDetails'])
        ->name('details')
        ->middleware('AuthorityCheck:asset,view');

    Route::get('/add', [AssetTypeController::class, 'showAssetTypeAddForm'])
        ->name('add')
        ->middleware('AuthorityCheck:asset,manage');

    Route::post('/add', [AssetTypeController::class, 'storeAssetType'])
        ->name('store')
        ->middleware('AuthorityCheck:asset,manage');

    Route::get('/{assetType}/edit', [AssetTypeController::class, 'showAssetTypeEditForm'])
        ->name('edit')
        ->middleware('AuthorityCheck:asset,manage');

    Route::put('/{assetType}/edit', [AssetTypeController::class, 'updateAssetType'])
        ->name('update')
        ->middleware('AuthorityCheck:asset,manage');

    Route::delete('/{assetType}/delete/', [AssetTypeController::class, 'destroy'])
        ->name('delete')
        ->middleware('AuthorityCheck:asset,manage');
});

Route::middleware(['auth', 'tenant'])->prefix('dashboard/repairs')->name('repairs.')->group(function () {
    Route::get('/', [RepairController::class, 'index'])
        ->name('index');

    Route::get('/{repair}/details', [RepairController::class, 'details'])
        ->name('details');

    Route::get('/add', [RepairController::class, 'showRepairAdd'])
        ->name('add');

    Route::post('/add', [RepairController::class, 'store'])
        ->name('store');

    Route::get('/{repair}/edit', [RepairController::class, 'showRepairEdit'])
        ->name('edit');

    Route::put('/{repair}/update', [RepairController::class, 'update'])
        ->name('update');

    Route::post('/{repair}/cancel', [RepairController::class, 'cancel'])
        ->name('cancel');

    Route::post('/{repair}/complete', [RepairController::class, 'complete'])
        ->name('complete');
})->middleware('permission:asset,repair');
