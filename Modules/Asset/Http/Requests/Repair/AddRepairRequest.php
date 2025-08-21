<?php

namespace Modules\Asset\Http\Requests\Repair;

use Illuminate\Foundation\Http\FormRequest;

class AddRepairRequest extends FormRequest
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
        return [
            'asset_id' => ['required', 'exists:assets,id'],
            'repair_start_date' => ['nullable', 'date'],
            'defect_description' => ['nullable', 'string', 'max:1000'],
            'corrective_action' => ['required', 'string', 'max:1000'],
            'repair_cost' => ['nullable', 'numeric', 'min:0'],
            'vendor' => ['required', 'string', 'max:255'],
            'vendor_address' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
