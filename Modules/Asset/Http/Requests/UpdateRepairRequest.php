<?php

namespace Modules\Asset\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRepairRequest extends FormRequest
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
            'vendor' => 'nullable|string|max:255',
            'defect_description' => 'nullable|string|max:255',
            'corrective_action' => 'nullable|string|max:255',
            'repair_start_date' => 'nullable|date',
            'repair_cost' => 'nullable|numeric',

        ];
    }
}
