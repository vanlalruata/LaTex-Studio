<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InsertEquationIntoFileRequest extends FormRequest
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
            'file_public_id' => ['required', 'string', 'uuid'],
            'latex' => ['required', 'string', 'max:100000'],
            'insert_at_line' => ['nullable', 'integer', 'min:1'],
            'expected_file_version' => ['nullable', 'integer', 'min:1'],
            'packages_to_add' => ['nullable', 'array'],
            'packages_to_add.*' => ['string', 'max:64'],
        ];
    }
}
