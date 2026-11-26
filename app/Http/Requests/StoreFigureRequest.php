<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFigureRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:120'],
            'schema_version' => ['required', 'integer', 'min:1'],
            'mode' => ['sometimes', 'string', Rule::in(['visual_native', 'hybrid', 'source_only'])],
            'scene_json' => ['required', 'array'],
            'tikz_source' => ['required', 'string', 'max:250000'],
            'required_packages_json' => ['nullable', 'array'],
            'required_packages_json.*' => ['string', 'max:64'],
            'required_libraries_json' => ['nullable', 'array'],
            'required_libraries_json.*' => ['string', 'max:64'],
        ];
    }
}
