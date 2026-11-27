<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BibliographyLookupRequest extends FormRequest
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
            'provider' => ['required', Rule::in(['crossref', 'arxiv', 'doi'])],
            'mode' => ['nullable', Rule::in(['lookup', 'search'])],
            'query' => ['required', 'string', 'min:2', 'max:512'],
        ];
    }
}
