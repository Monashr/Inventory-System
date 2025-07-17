<?php

namespace Modules\Profile\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render("Profile/ProfileIndex", [
            "user" => auth()->user(),
        ]);
    }

    public function edit()
    {
        return Inertia::render("Profile/ProfileEdit", [
            "user" => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'phone' => 'nullable|max:20',
            'bio' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('picture')) {
            if ($user->picture && Storage::disk('public')->exists($user->picture)) {
                Storage::disk('public')->delete($user->picture);
            }

            $manager = new ImageManager(new Driver());

            $image = $manager->read($request->file('picture')->getRealPath());

            $image->cover(500, 500);

            $filename = uniqid('profile_') . '.jpg';
            $path = 'profile_pictures/' . $filename;

            Storage::disk('public')->put($path, (string) $image->toJpeg());

            $validated['picture'] = $path;
        }

        $user->update($validated);

        return redirect()->route('profile.index')->with('success', 'Profile updated.');
    }



}
