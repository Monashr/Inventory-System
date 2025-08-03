<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTenantRequest;
use App\Http\Services\PictureService;
use App\Http\Services\TenantService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $pictureService;
    protected $tenantService;

    public function __construct(PictureService $pictureService, TenantService $tenantService)
    {
        $this->pictureService = $pictureService;
        $this->tenantService = $tenantService;
    }

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

    public function updateTenant(UpdateTenantRequest $request)
    {
        $tenant = tenant();

        $validated = $request->validated();

        if ($request->hasFile('picture')) {
            $validated['pictures'] = $this->pictureService->handlePictureUpload($request->file('picture'), 'organization_picture/', $tenant->picture);
        }

        if ($request->filled('address') && $request->address !== $tenant->address) {
            $this->tenantService->changeDefaultAddress($request->address);
        }

        $tenant->update($validated);

        return redirect()->route('tenant.index');
    }
}