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
        $perPage = $request->input('per_page', 10);

        $items = Item::paginate($perPage);

        return Inertia::render('Items/ItemsIndex', [
            'items' => $items
        ]);
    }

    public function showAddForm()
    {
        return Inertia::render("Items/ItemsAdd");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'integer|min:0',
        ]);

        // Create item
        $item = Item::create([
            'name' => $validated['name'],
        ]);

        // Generate units
        $now = Carbon::now()->timestamp;
        $slug = Str::slug($item->name);

        for ($i = 1; $i <= $validated['unit']; $i++) {
            Unit::create([
                'item_id' => $item->id,
                'unit_code' => "{$slug}-{$now}-{$i}",  // Example: chair-1720998491-1
                'available' => true,
            ]);
        }

        return redirect()->route('items.index')->with('success', 'Item created successfully with units.');
    }

    public function showEditForm(Item $item)
    {
        if ($item->tenant_id !== tenant()->id) {
            abort(403, 'Unauthorized access.');
        }

        return Inertia::render("Items/ItemsEdit", [
            "item" => $item,
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
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
        $perPage = $request->input('per_page', 10);

        $units = Unit::paginate($perPage);

        $item = Item::find($item);

        return Inertia::render('Items/UnitIndex', [
            'units' => $units,
            'item' => $item,
        ]);
    }

}
