<?php

namespace Modules\Asset\Http\Services;

use Modules\Asset\Models\AssetType;

class AssetTypeService
{
    protected $assetLogService;

    public function __construct(AssetLogService $assetLogService)
    {
        $this->assetLogService = $assetLogService;
    }
    public function findAssetType($assetType)
    {
        return AssetType::findOrFail($assetType);
    }

    public function getAllAssetTypes()
    {
        return AssetType::all();
    }

    public function getAssetTypePagination($request, $perPage)
    {
        $query = AssetType::query();

        if ($request->filled('name')) {
            $query->where('name', 'LIKE', '%' . $request->name . '%');
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        $allowedSorts = ['name', 'model', 'created_at'];

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

    public function getAllAssetTypeFilters()
    {
        return [
            'name' => $this->getAllAssetTypeNames(),
            'model' => $this->getAllAssetTypeModels(),
        ];
    }

    public function createAssetType($validated)
    {
        return AssetType::create([
            'name' => $validated['name'],
            'model' => $validated['model'],
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }
}