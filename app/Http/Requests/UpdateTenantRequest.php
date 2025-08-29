<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTenantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255'],
                'phone' => ['nullable', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'address' => ['nullable', 'string', 'max:255'],
                'industry' => ['nullable', 'string', 'max:255'],
                'website' => ['nullable', 'url', 'max:255'],
                'picture' => ['nullable', 'image', 'max:2048'],
            ];
    }
}
