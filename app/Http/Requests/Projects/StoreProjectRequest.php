<?php

namespace App\Http\Requests\Projects;

use App\Enums\CompilerEngine;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'template_id' => ['nullable', 'string', Rule::exists('templates', 'public_id')],
            'compiler_engine' => ['nullable', Rule::enum(CompilerEngine::class)],
        ];
    }
}
