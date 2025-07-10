<?php

namespace Modules\Items\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Items\Models\Item;
use Inertia\Inertia;

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
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        Item::create($validated);

        return redirect()->route('items.index')->with('success', 'Item created successfully.');
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

}
