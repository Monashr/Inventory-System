<?php

use Illuminate\Support\Facades\Route;
use Modules\Items\Http\Controllers\ItemsController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('items', ItemsController::class)->names('items');
});
