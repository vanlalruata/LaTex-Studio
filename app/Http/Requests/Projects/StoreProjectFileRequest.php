<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'path' => ['required', 'string', 'max:512'],
            'content' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:20480'],
            'is_directory' => ['sometimes', 'boolean'],
        ];
    }
}
