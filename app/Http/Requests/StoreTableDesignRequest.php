<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTableDesignRequest extends FormRequest
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
            'document_json' => ['required', 'array'],
            'generated_latex' => ['required', 'string', 'max:200000'],
            'status' => ['sometimes', 'string', Rule::in(['visual', 'source_only'])],
        ];
    }
}
