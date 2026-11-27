<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEquationRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:160'],
            'schema_version' => ['sometimes', 'integer', 'min:1'],
            'content_mode' => ['sometimes', 'string', Rule::in(['structured', 'hybrid', 'source'])],
            'math_mode' => ['sometimes', 'string', Rule::in(['inline', 'display'])],
            'environment' => ['sometimes', 'string', 'max:32'],
            'structured_document_json' => ['nullable', 'array'],
            'latex_source' => ['required', 'string', 'max:100000'],
            'package_requirements_json' => ['nullable', 'array'],
            'package_requirements_json.*' => ['string', 'max:64'],
        ];
    }
}
