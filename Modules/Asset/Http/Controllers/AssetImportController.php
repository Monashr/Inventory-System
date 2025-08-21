<?php

namespace Modules\Asset\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Asset\Imports\AssetImport;
use Modules\Asset\Exports\AssetExport;
use Maatwebsite\Excel\Facades\Excel;
use Exception;

class AssetImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv',
        ]);

        try {
            Excel::import(new AssetImport(), $request->file('file'));
            return redirect()->route('assets.index')->with('success', 'Assets imported successfully!');
        } catch (Exception $e) {
            return redirect()->route('assets.index')->with('success', 'Import failed: ' . $e->getMessage());
        }
    }

    public function template()
    {
        $path = storage_path('app/public/templates/ImportTemplate.xlsx');

        if (!file_exists($path)) {
            abort(404, 'Template file not found.');
        }

        return response()->download($path);
    }

    public function export()
    {
        return Excel::download(new AssetExport, 'assets.xlsx');
    }

}
