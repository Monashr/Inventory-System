<?php

namespace Modules\Asset\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Asset\Models\AssetType;
use Modules\Asset\Models\Asset;
use Inertia\Inertia;
use Carbon\Carbon;

class AssetController extends Controller
{
    public function index(Request $request)
    {

        $permission = config('asset.permissions')['permissions']['view'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        $assetTypes = AssetType::paginate($perPage);

        return Inertia::render('Asset/AssetTypesIndex', [
            'assetTypes' => $assetTypes,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function showAddForm()
    {
        $permission = config('Asset.permissions')['permissions']['edit'];

        dd($permission);

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render("Asset/AssetTypesAdd");
    }

    public function store(Request $request)
    {
        $permission = config('asset.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'unit' => 'integer|min:0',
        ]);

        $assetType = AssetType::create([
            'name' => $validated['name'],
            'model' => $validated['model'],
        ]);

        $now = Carbon::now()->timestamp;
        $slug = Str::slug($assetType->name);

        for ($i = 1; $i <= $validated['unit']; $i++) {
            Asset::create([
                'asset_type_id' => $assetType->id,
                'serial_code' => "{$slug}-{$now}-{$i}",
                'updated_by' => auth()->user()->id,
                'created_by' => auth()->user()->id,
            ]);
        }

        return redirect()->route('assets.index')->with('success', 'Item created successfully with units.');
    }

    public function showEditForm(AssetType $assetType)
    {
        $permission = config('asset.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        if ($assetType->tenant_id !== tenant()->id) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render("Asset/AssetTypesEdit", [
            "assetType" => $assetType,
        ]);
    }

    public function update(Request $request, AssetType $AssetType)
    {
        $permission = config('asset.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'model' => 'required|string|max:255',
        ]);

        $AssetType->update($validated);

        return redirect()->route('assets.index');
    }

    public function destroy($id)
    {
        $assetType = AssetType::findOrFail($id);

        if ($assetType->tenant_id !== tenant()->id) {
            abort(403, 'Unauthorized access.');
        }

        $assetType->delete();

        return redirect()->route('assets.index')->with('success', 'Item deleted successfully');
    }

    public function asset(Request $request, $assetType)
    {
        $permission = config('asset.permissions')['permissions']['view'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        $assets = Asset::where('asset_type_id', $assetType)->paginate($perPage);

        $totalAvailableAssets = Asset::where('asset_type_id', $assetType)
            ->where('avaibility', 'available')
            ->count();

        $totalLoanedAssets = Asset::where('asset_type_id', $assetType)
            ->where('avaibility', 'loaned')
            ->count();

        $totalDefectAssets = Asset::where('asset_type_id', $assetType)
            ->where('avaibility', 'defect')
            ->count();


        $assetType = AssetType::find($assetType);

        return Inertia::render('Asset/AssetsIndex', [
            'assets' => $assets,
            'assetType' => $assetType,
            'permissions' => auth()->user()->getTenantPermission(),
            'totalAvailableAssets' => $totalAvailableAssets,
            'totalLoanedAssets' => $totalLoanedAssets,
            'totalDefectAssets' => $totalDefectAssets,
        ]);
    }

    public function showAssetDetails($asset)
    {
        $asset = Asset::with('assetType', 'loans')->findOrFail($asset);

        return Inertia::render('Asset/AssetsDetails', [
            'asset' => $asset,
        ]);
    }

    public function showAssetAdd()
    {
        $assetTypes = AssetType::all();
        return Inertia::render('Asset/AssetsAdd', [
            'assetTypes' => $assetTypes,
        ]);
    }

    public function storeAssets(Request $request)
    {
        $permission = config('asset.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }


        $validated = $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'serial_code' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'specification' => 'nullable|string',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric',
            'initial_condition' => 'required|in:new,used,defect',
            'condition' => 'required|in:good,used,defect',
            'avaibility' => 'required|in:available,loaned,repair',
        ]);


        $assetType = AssetType::findOrFail($validated['asset_type_id']);

        $createdBy = auth()->user()->id;

        Asset::create([
            'asset_type_id' => $assetType->id,
            'serial_code' => $validated['serial_code'],
            'brand' => $validated['brand'],
            'specification' => $validated['specification'],
            'purchase_date' => $validated['purchase_date'],
            'purchase_price' => $validated['purchase_price'],
            'initial_condition' => $validated['initial_condition'],
            'condition' => $validated['condition'],
            'avaibility' => $validated['avaibility'],
            'created_by' => $createdBy,
            'updated_by' => $createdBy,
            'tenant_id' => auth()->user()->tenant_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('assets.index')->with('success', 'Assets added successfully.');
    }

    public function showAssetEdit($asset)
    {

        $asset = Asset::findOrFail($asset);
        $assetTypes = AssetType::all();

        return Inertia::render('Asset/AssetsEdit', [
            'asset' => $asset,
            'assetTypes' => $assetTypes
        ]);
    }

    public function assetUpdate(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'asset_type_id' => 'required|exists:asset_types,id',
            'serial_code' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'specification' => 'nullable|string',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric',
            'initial_condition' => 'required|in:new,used,defect',
            'condition' => 'required|in:good,used,defect',
            'avaibility' => 'required|in:available,loaned,repair',
        ]);

        $asset->update($validated);

        return redirect()->route('assets.index');
    }


    public function getAssets($assetType)
    {
        $assets = Asset::where('asset_type_id', $assetType)->where('avaibility', 'available')->get(['id', 'serial_code']);
        return response()->json($assets);
    }
}
