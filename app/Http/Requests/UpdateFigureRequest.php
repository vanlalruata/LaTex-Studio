<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFigureRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:120'],
            'schema_version' => ['sometimes', 'integer', 'min:1'],
            'mode' => ['sometimes', 'string', Rule::in(['visual_native', 'hybrid', 'source_only'])],
            'scene_json' => ['sometimes', 'array'],
            'tikz_source' => ['sometimes', 'string', 'max:250000'],
            'required_packages_json' => ['nullable', 'array'],
            'required_packages_json.*' => ['string', 'max:64'],
            'required_libraries_json' => ['nullable', 'array'],
            'required_libraries_json.*' => ['string', 'max:64'],
        ];
    }
}
