<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class PictureService
{
    public function handlePictureUpload($file, $savePath, $existingPath = null): string
    {
        $disk = Storage::disk('public');

        if ($existingPath && $disk->exists($existingPath)) {
            $disk->delete($existingPath);
        }

        $manager = new ImageManager(new Driver());
        $image = $manager->read($file->getRealPath());
        $image->cover(500, 500);

        $filename = uniqid('profile_') . '.jpg';
        $path = $savePath . $filename;

        $disk->put($path, (string) $image->toJpeg());

        return $path;
    }

}
