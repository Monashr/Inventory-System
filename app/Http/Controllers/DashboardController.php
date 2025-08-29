<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateTenantRequest;
use App\Http\Services\PictureService;
use App\Http\Services\TenantService;
use Inertia\Inertia;
use Modules\Asset\Http\Services\AssetService;
use Modules\Loans\Http\Services\LoanService;

class DashboardController extends Controller
{
    protected $pictureService;

    protected $tenantService;

    protected $assetService;

    protected $loanService;

    public function __construct(PictureService $pictureService, TenantService $tenantService, AssetService $assetService, LoanService $loanService)
    {
        $this->pictureService = $pictureService;
        $this->tenantService = $tenantService;
        $this->assetService = $assetService;
        $this->loanService = $loanService;
    }

    public function dashboard()
    {
        $totalAssets = $this->assetService->getTotalAssets();
        $availableAssets = $this->assetService->getTotalAvailableAssets();

        $defectAssets = $this->assetService->getTotalDefectAssets();

        $recentLoanedAssets = $this->assetService->getRecentLoanedAssets();
        $totalLoanedAssets = $this->assetService->getTotalLoanedAssets();

        $totalAssetsInRepair = $this->assetService->getTotalAssetsInRepair();
        $recentAssetsInRepair = $this->assetService->getRecentAssetsInRepair();

        $recentEmployees = $this->tenantService->getRecentUsersInTenant(tenant()->id);

        return Inertia::render('DashboardIndex', [
            'totalAssets' => $totalAssets,
            'totalAvailableAssets' => $availableAssets,
            'totalDefectAssets' => $defectAssets,
            'totalLoanedAssets' => $totalLoanedAssets,
            'recentLoanedAssets' => $recentLoanedAssets,
            'totalAssetsInRepair' => $totalAssetsInRepair,
            'recentAssetsInRepair' => $recentAssetsInRepair,
            'recentEmployees' => $recentEmployees,
            'tenant' => tenant(),
        ]);
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
