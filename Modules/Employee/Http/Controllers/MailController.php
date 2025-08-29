<?php

namespace Modules\Employee\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Employee\Http\Requests\Mail\CreateMailRequest;
use Modules\Employee\Http\Services\MailService;
use Modules\Employee\Models\Mail;

class MailController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function inviteByEmail(CreateMailRequest $request)
    {
        return $this->mailService->storeMail($request);
    }

    public function showInbox(Request $request)
    {
        return Inertia::render('Employee/EmployeesInbox', [
            'inbox' => $this->mailService->getAllMailPagination($request),
            'user' => auth()->user(),
            'filters' => [
                'search' => $request->search,
                'sort_by' => $request->sort_by,
                'sort_direction' => $request->sort_direction,
            ],
        ]);
    }

    public function mailDetails($id)
    {
        return Inertia::render('Employee/MailDetail', [
            'mail' => $this->mailService->getMailById($id),
            'user' => auth()->user(),
        ]);
    }

    public function acceptInvitation($id)
    {
        $inbox = Mail::findOrFail($id);

        if ($inbox->receiver_id !== auth()->user()->id) {
            abort(403);
        }

        $user = auth()->user();
        $tenantId = $inbox->tenant_id;

        if (! $user->tenants()->where('tenant_id', $tenantId)->exists()) {
            $user->tenants()->attach($tenantId);
        }

        $inbox->update([
            'status' => 'accepted',
        ]);

        return redirect()->back()->with('success', 'Invitation Accepted.');
    }

    // INBOX
    public function declineInvitation($id)
    {
        $inbox = Mail::findOrFail($id);

        if ($inbox->receiver_id !== auth()->user()->id) {
            abort(403);
        }

        $inbox->update([
            'status' => 'rejected',
        ]);

        return redirect()->back()->with('info', 'Invitation declined.');
    }
}
