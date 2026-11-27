<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompilerSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'driver' => ['required', Rule::in(['docker', 'local'])],
            'docker_image' => ['required', 'string', 'max:255'],
            'docker_memory_mb' => ['required', 'integer', 'min:256', 'max:16384'],
            'docker_cpus' => ['required', 'numeric', 'min:0.25', 'max:16'],
            'docker_pids_limit' => ['required', 'integer', 'min:16', 'max:1024'],
            'local_texlive_bin_path' => ['nullable', 'string', 'max:512'],
            'local_latexmk_path' => ['required', 'string', 'max:255'],
            'auto_install_packages' => ['sometimes', 'boolean'],
            'wall_timeout' => ['required', 'integer', 'min:10', 'max:600'],
            'max_output_mb' => ['required', 'integer', 'min:5', 'max:1024'],
        ];
    }
}
