<?php

namespace Modules\Employee\Http\Services;

use Modules\Employee\Http\Requests\Mail\CreateMailRequest;
use Modules\Employee\Models\Mail;

class MailService
{
    public function __construct(
        protected EmployeeService $employeeService,
    ) {
    }

    public function getAllMailPagination($request)
    {
        $perPage = $request->input('per_page', 10);

        $query = Mail::query()
            ->leftJoin('users as s', 'mails.sender_id', '=', 's.id')
            ->leftJoin('users as r', 'mails.receiver_id', '=', 'r.id')
            ->leftJoin('tenants as t', 'mails.tenant_id', '=', 't.id')
            ->select(
                'mails.id',
                'mails.status',
                'mails.created_at',
                's.name as sender_name',
                'r.name as receiver_name',
                't.name as tenant_name'
            );

        $allowedSorts = ['sender', 'receiver', 'tenant', 'sent_at', 'status'];

        $sortBy = $request->get('sort_by');
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        $sortDirection = strtolower($request->get('sort_direction', 'asc'));
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage)->withQueryString();
    }

    public function getMailById($id)
    {
        return Mail::query()
            ->leftJoin('users as s', 'mails.sender_id', '=', 's.id')
            ->leftJoin('users as r', 'mails.receiver_id', '=', 'r.id')
            ->leftJoin('tenants as t', 'mails.tenant_id', '=', 't.id')
            ->select(
                'mails.id',
                'mails.status',
                'mails.created_at',
                's.name as sender_name',
                'r.name as receiver_name',
                't.name as tenant_name'
            )
            ->where('mails.id', $id)
            ->first();
    }

    public function storeMail(CreateMailRequest $request)
    {
        $request->validated();

        $user = $this->employeeService->getEmployeeByEmail($request->email);
        $tenantId = session('active_tenant_id');

        // 1. Already member?
        if ($this->checkUserIfAlreadyInTenant($user, $tenantId)) {
            return back()->with('error', 'This user is already part of the tenant.');
        }

        // 2. Already has a pending invite?
        if ($this->checkIfAlreadyInvited($user, $tenantId)) {
            return back()->with('error', 'This user already has a pending invitation.');
        }

        // 3. Send new invitation
        $this->createMail($user, $tenantId);

        return redirect()->route('employees.index')
            ->with('success', 'Employee successfully invited to tenant.');
    }

    private function checkUserIfAlreadyInTenant($user, $tenantId): bool
    {
        return $user->tenants()->where('tenant_id', $tenantId)->exists();
    }

    private function checkIfAlreadyInvited($user, $tenantId): bool
    {
        // If user is still in tenant, block at the "already in tenant" check
        // Otherwise, only block if there's a PENDING invitation
        return Mail::where('receiver_id', $user->id)
            ->where('tenant_id', $tenantId)
            ->where('status', 'pending')
            ->exists();
    }

    public function createMail($receiver, $tenantId)
    {
        Mail::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $receiver->id,
            'tenant_id' => $tenantId,
        ]);
    }

}
