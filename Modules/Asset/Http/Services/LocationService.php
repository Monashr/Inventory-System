<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\Location;

class LocationService
{
    private const DEFAULT_NAME = '__tenant_default__';

    private const DEFAULT_ADDRESS = 'none';

    public function getLocation($name)
    {
        return Location::where('name', $name)->first();
    }

    public function getAllLocationNoDefault()
    {
        return Location::where('name', '!=', self::DEFAULT_NAME)->get();
    }

    public function getAllLocationNoDefaultDistinc()
    {
        return Location::select('name')
            ->distinct()
            ->whereNotNull('name')
            ->where('name', '!=', '')
            ->where('name', '!=', self::DEFAULT_NAME)
            ->orderBy('name')
            ->get()
            ->pluck('name');
    }

    public function getLocationByVendor($name, $address)
    {
        $location = Location::where('name', $name)->first();

        if (! $location) {
            return Location::create([
                'name' => $name,
                'address' => $address,
            ]);
        }
        if ($location->address !== $address) {
            $location->update(['address' => $address]);
        }

        return $location;
    }

    public function getOrCreateDefaultLocation()
    {
        return Location::firstOrCreate(
            ['name' => self::DEFAULT_NAME],
            ['address' => self::DEFAULT_ADDRESS]
        );
    }

    public function changeDefaultLocationAddress($newAddress)
    {
        $location = Location::where('name', self::DEFAULT_NAME)->first();

        if ($location) {
            $location->address = $newAddress;
            $location->save();
        } else {
            $location = Location::create([
                'name' => self::DEFAULT_NAME,
                'address' => $newAddress,
            ]);
        }

        return $location;
    }
}
