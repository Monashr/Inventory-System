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

        $this->checkUserIfAlreadyInTenant($user, $tenantId);

        $this->createMail($user, $tenantId);
    }

    private function checkUserIfAlreadyInTenant($user, $tenantId)
    {
        if ($user->tenants()->where('tenant_id', $tenantId)->exists()) {
            return back()->withErrors(['email' => 'This user is already part of the tenant.']);
        }
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
