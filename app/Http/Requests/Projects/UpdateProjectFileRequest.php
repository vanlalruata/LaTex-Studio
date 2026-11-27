<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectFileRequest extends FormRequest
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
            'content' => ['present', 'string'],
            'expected_version' => ['nullable', 'integer', 'min:1'],
            'base_sha256' => ['nullable', 'string', 'size:64'],
        ];
    }
}
