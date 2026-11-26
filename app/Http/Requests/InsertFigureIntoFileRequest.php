<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InsertFigureIntoFileRequest extends FormRequest
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
            'figure_public_id' => ['nullable', 'string', 'uuid'],
            'file_public_id' => ['required', 'string', 'uuid'],
            'mode' => ['required', 'string', Rule::in(['inline', 'external'])],
            'tikz_source' => ['required', 'string', 'max:250000'],
            'figure_slug' => ['nullable', 'string', 'max:80'],
            'caption' => ['nullable', 'string', 'max:500'],
            'label' => ['nullable', 'string', 'max:120'],
            'placement' => ['nullable', 'string', 'max:16'],
            'insert_at_line' => ['nullable', 'integer', 'min:1'],
            'packages_to_add' => ['nullable', 'array'],
            'packages_to_add.*' => ['string', 'max:64'],
            'libraries_to_add' => ['nullable', 'array'],
            'libraries_to_add.*' => ['string', 'max:64'],
        ];
    }
}
