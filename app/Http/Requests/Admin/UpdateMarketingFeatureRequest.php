<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMarketingFeatureRequest extends FormRequest
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
            'slug' => [
                'required', 'string', 'max:120', 'alpha_dash',
                Rule::unique('marketing_features', 'slug')->ignore($this->route('feature')),
            ],
            'title' => ['required', 'string', 'max:255'],
            'summary' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', 'string', 'max:100'],
            'availability_status' => ['required', Rule::in(['available', 'beta', 'planned', 'disabled'])],
            'icon_key' => ['required', Rule::in(['code', 'file-text', 'book', 'users', 'sparkles', 'git-branch', 'sigma', 'layout', 'scan'])],
            'is_featured' => ['required', 'boolean'],
            'is_public' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'between:0,65535'],
        ];
    }
}
