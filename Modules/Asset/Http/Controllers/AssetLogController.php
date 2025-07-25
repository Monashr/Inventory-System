<?php

namespace Modules\Asset\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AssetLogController extends Controller
{
    public function index()
    {
        return Inertia::render('Asset/AssetLogIndex');
    }
}
