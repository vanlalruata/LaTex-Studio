<?php

namespace App\Http\Requests\Admin;

use App\Domain\Files\PathValidator;
use App\Enums\CompilerEngine;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreTemplateRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:120', 'alpha_dash', 'unique:templates,slug'],
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:64'],
            'description' => ['nullable', 'string', 'max:2000'],
            'compiler_engine' => ['required', Rule::in(array_column(CompilerEngine::cases(), 'value'))],
            'files_manifest' => ['required', 'array', 'min:1', 'max:40'],
            'files_manifest.*' => ['required', 'array:path,content'],
            'files_manifest.*.path' => ['required', 'string', 'max:512', 'distinct'],
            'files_manifest.*.content' => ['required', 'string', 'max:1048576'],
            'is_public' => ['required', 'boolean'],
        ];
    }

    /**
     * @return list<\Closure(Validator): void>
     */
    public function after(): array
    {
        return [function (Validator $validator): void {
            $files = $this->input('files_manifest');

            if (! is_array($files)) {
                return;
            }

            $normalizer = app(PathValidator::class);
            $seenPaths = [];
            $totalBytes = 0;

            foreach ($files as $index => $file) {
                if (! is_array($file) || ! is_string($file['path'] ?? null) || ! is_string($file['content'] ?? null)) {
                    continue;
                }

                try {
                    $normalizedPath = $normalizer->normalize($file['path']);
                } catch (\InvalidArgumentException $exception) {
                    $validator->errors()->add("files_manifest.{$index}.path", $exception->getMessage());

                    continue;
                }

                if (isset($seenPaths[$normalizedPath])) {
                    $validator->errors()->add("files_manifest.{$index}.path", 'File paths must be unique after normalization.');
                }

                $seenPaths[$normalizedPath] = true;
                $totalBytes += mb_strlen($file['content'], '8bit');
            }

            if ($totalBytes > 5 * 1024 * 1024) {
                $validator->errors()->add('files_manifest', 'Combined template file content cannot exceed 5 MB.');
            }
        }];
    }
}
