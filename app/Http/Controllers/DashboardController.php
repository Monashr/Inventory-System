<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
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
        return Inertia::render('TenantIndex', [
            'tenant' => tenant(),
        ]);
    }

    public function editTenant()
    {
        return Inertia::render('TenantEdit', [
            'tenant' => tenant(),
        ]);
    }

    public function updateTenant(Request $request)
    {
        $tenant = tenant();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'address' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'picture' => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('picture')) {
            if ($tenant->picture && Storage::disk('public')->exists($tenant->picture)) {
                Storage::disk('public')->delete($tenant->picture);
            }

            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('picture')->getRealPath());

            $image->cover(500, 500);

            $filename = uniqid('profile_') . '.jpg';
            $path = 'organization_picture/' . $filename;

            Storage::disk('public')->put($path, (string) $image->toJpeg());

            $validated['pictures'] = $path;
        }

        $tenant->update($validated);

        return redirect()->route('tenant.index');
    }
}