<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('DashboardIndex');
    }

    public function showTenant()
    {
        return Inertia::render('Tenant', [
            'tenant' => tenant(),
        ]);
    }

    public function updateTenant(Request $request)
    {
        $tenant = tenant();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $tenant->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Organization updated successfully.');
    }

}
