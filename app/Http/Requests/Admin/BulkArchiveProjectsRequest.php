<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkArchiveProjectsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('manage-public-site') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'project_ids' => ['required', 'array', 'min:1', 'max:50'],
            'project_ids.*' => ['required', 'string', 'distinct', Rule::exists('projects', 'public_id')],
        ];
    }
}
