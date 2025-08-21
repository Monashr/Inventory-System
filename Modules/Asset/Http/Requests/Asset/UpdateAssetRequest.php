<?php

namespace Modules\Asset\Http\Requests\Asset;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
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
            'asset_type_id' => 'required|exists:asset_types,id',
            'serial_code' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'specification' => 'nullable|string',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric',
            'initial_condition' => 'required|in:new,used,defect',
            'condition' => 'required|in:good,used,defect',
            'availability' => 'required|in:available,loaned,repair',
        ];
    }
}
