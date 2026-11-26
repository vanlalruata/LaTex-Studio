<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InsertTableIntoFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file_public_id' => ['required', 'uuid'],
            'latex' => ['required', 'string', 'max:200000'],
            'insert_at_line' => ['nullable', 'integer', 'min:1'],
            'packages_to_add' => ['nullable', 'array'],
            'packages_to_add.*.packageName' => ['required', 'string', 'max:60', 'alpha_dash'],
            'packages_to_add.*.options' => ['nullable', 'array'],
            'packages_to_add.*.options.*' => ['string', 'max:40'],
            'table_design_public_id' => ['nullable', 'uuid'],
        ];
    }
}
