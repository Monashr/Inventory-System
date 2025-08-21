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

    public function storeAssetType($request)
    {
        $validated = $request->validated();

        $this->createAssetType($validated);
    }

    public function createAssetType($validated)
    {
        return AssetType::create([
            'name' => $validated['name'],
            'model' => $validated['model'],
            'code' => $validated['code'],
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);
    }
    public function updateAssetType($request, $assetType)
    {
        $validated = $request->validated();

        $assetType->update($validated);
    }

    public function deleteAssetType($assetType)
    {
        $assetType = $this->findAssetType($assetType);

        $assetType->deleted_by = auth()->id();

        $assetType->save();

        $assetType->delete();
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