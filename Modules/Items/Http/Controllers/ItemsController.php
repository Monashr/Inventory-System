<?php

namespace Modules\Items\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\Items\Models\Item;
use Modules\Items\Models\Unit;
use Inertia\Inertia;
use Carbon\Carbon;

class ItemsController extends Controller
{
    public function index(Request $request)
    {

        $permission = config('items.permissions')['permissions']['view'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        $items = Item::paginate($perPage);

        return Inertia::render('Items/ItemsIndex', [
            'items' => $items,
            'permissions' => auth()->user()->getTenantPermission(),
        ]);
    }

    public function showAddForm()
    {
        $permission = config('items.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render("Items/ItemsAdd");
    }

    public function store(Request $request)
    {
        $permission = config('items.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'integer|min:0',
        ]);

        $item = Item::create([
            'name' => $validated['name'],
        ]);

        $now = Carbon::now()->timestamp;
        $slug = Str::slug($item->name);

        for ($i = 1; $i <= $validated['unit']; $i++) {
            Unit::create([
                'item_id' => $item->id,
                'unit_code' => "{$slug}-{$now}-{$i}",
                'available' => true,
            ]);
        }

        return redirect()->route('items.index')->with('success', 'Item created successfully with units.');
    }

    public function showEditForm(Item $item)
    {
        $permission = config('items.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        if ($item->tenant_id !== tenant()->id) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render("Items/ItemsEdit", [
            "item" => $item,
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $permission = config('items.permissions')['permissions']['edit'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item->update($validated);

        return redirect()->route('items.index');
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        if ($item->tenant_id !== tenant()->id) {
            abort(403, 'Unauthorized access.');
        }

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully');
    }

    public function unit(Request $request, $item)
    {
        $permission = config('items.permissions')['permissions']['view'];

        if (!checkAuthority($permission)) {
            return redirect()->route('dashboard.index');
        }

        $perPage = $request->input('per_page', 10);

        $units = Unit::paginate($perPage);

        $totalAvailableUnits = Unit::where('available', true)->count();

        $item = Item::find($item);

        return Inertia::render('Items/UnitIndex', [
            'units' => $units,
            'item' => $item,
            'permissions' => auth()->user()->getTenantPermission(),
            'totalAvailableUnits' => $totalAvailableUnits,
        ]);
    }

    public function getUnit($item) {
        $units = Unit::where('item_id', $item)->where('available', true)->get(['id', 'unit_code']);
        return response()->json($units);
    }

}
