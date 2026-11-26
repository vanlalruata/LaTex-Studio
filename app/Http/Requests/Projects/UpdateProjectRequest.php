<?php

namespace App\Http\Requests\Projects;

use App\Enums\BuildProfile;
use App\Enums\CompilerEngine;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'root_file_path' => ['sometimes', 'required', 'string', 'max:512'],
            'compiler_engine' => ['sometimes', 'required', Rule::enum(CompilerEngine::class)],
            'build_profile' => ['sometimes', 'required', Rule::enum(BuildProfile::class)],
            'bibliography_tool' => ['sometimes', 'required', Rule::in(['bibtex', 'biber'])],
            'auto_compile' => ['sometimes', 'boolean'],
        ];
    }
}
