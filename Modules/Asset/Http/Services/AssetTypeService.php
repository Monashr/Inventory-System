<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\Asset;
use Modules\Asset\Models\AssetType;

class AssetTypeService
{
    public function __construct(
        protected AssetLogService $assetLogService,
    ) {
    }
    public function findAssetType($assetType)
    {
        return AssetType::findOrFail($assetType);
    }

    public function findAssetTypeWithAsset($assetType)
    {
        return AssetType::with('assets')->findOrFail($assetType);
    }

    public function getAllAssetTypeWithAsset()
    {
        return AssetType::with('assets')->get();
        ;
    }

    public function getAllAssetTypes()
    {
        return AssetType::all();
    }

    public function getAssetTypePagination($request)
    {
        $perPage = $request->input('per_page', 10);

        $query = AssetType::query();

        if ($request->filled('name')) {
            $query->where('name', 'LIKE', '%' . $request->name . '%');
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        $allowedSorts = ['name', 'model', 'created_at', 'code'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'name';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
        }

        $assetTypes = $query->paginate($perPage)->withQueryString();

        return $assetTypes;
    }

    public function storeAssetType($request)
    {
        $validated = $request->validated();

        $this->createAssetType($validated);
    }

    public function extractBeforeVowel(string $input): string
    {
        $words = explode(' ', strtolower($input));
        $result = '';

        foreach ($words as $word) {
            $len = strlen($word);

            for ($i = 1; $i < $len; $i++) {
                if (preg_match('/[aeiou]/', $word[$i])) {
                    $result .= $word[$i - 1];
                }
            }
        }

        return $result;
    }

    public function createAssetType($validated)
    {
        return AssetType::create([
            'name' => $validated['name'],
            'model' => $validated['model'],
            'code' => $this->extractBeforeVowel($validated['name']),
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }
    public function updateAssetType($request, $assetType)
    {
        $validated = $request->validated();

        if (isset($validated['name'])) {
            $validated['code'] = $this->extractBeforeVowel($validated['name']);
        }

        $validated['updated_by'] = auth()->id();

        $assetType->update($validated);

        $assets = $this->getAllAssetsByAssetType($assetType->id);

        foreach ($assets as $asset) {
            $asset->update([
                'serial_code' => $this->generateSerialFromType($assetType->code),
                'updated_by' => auth()->id(),
            ]);
        }

        return $assetType;
    }

    public function generateSerialFromType($code)
    {
        if (!$code) {
            $slug = 'unknown';
        } else {
            $slug = strtolower($code);
            $slug = preg_replace('/\s+/', '-', $slug);
            $slug = preg_replace('/[^\w\-]+/', '', $slug);
        }

        $now = (int) round(microtime(true) * 1000);

        return "{$slug}-{$now}";
    }

    public function getAllAssetsByAssetType($assetType)
    {
        return Asset::where('asset_type_id', $assetType)->get();
    }


    public function deleteAssetType($assetType)
    {
        $assetType = $this->findAssetTypeWithAsset($assetType);

        $hasRepairAssets = $assetType->assets()
            ->where('availability', 'repair')
            ->exists();

        if ($hasRepairAssets) {
            return false;
        }

        $assetType->deleted_by = auth()->id();

        $assetType->save();

        $assetType->delete();

        return true;
    }

    public function getAllAssetTypeNames()
    {
        return AssetType::select('name')
            ->distinct()
            ->whereNotNull('name')
            ->where('name', '!=', '')
            ->orderBy('name')
            ->get()
            ->pluck('name');
    }

    public function getAllAssetTypeModels()
    {
        return AssetType::select('model')
            ->distinct()
            ->whereNotNull('model')
            ->where('model', '!=', '')
            ->orderBy('model')
            ->get()
            ->pluck('model');
    }

    public function getAllAssetTypeFilterValues()
    {
        return [
            'name' => $this->getAllAssetTypeNames(),
            'model' => $this->getAllAssetTypeModels(),
        ];
    }

    public function getAllAssetTypeFilters($request)
    {
        return [
            'search' => $request->search,
            'sort_by' => $request->sort_by,
            'sort_direction' => $request->sort_direction,
            'name' => $request->name,
            'model' => $request->model,
        ];
    }
}