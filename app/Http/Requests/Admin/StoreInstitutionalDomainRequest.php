<?php

namespace App\Http\Requests\Admin;

use App\Services\InstitutionalAccessService;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInstitutionalDomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->domain)) {
            $this->merge([
                'domain' => strtolower(trim(ltrim($this->domain, '@'))),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $service = app(InstitutionalAccessService::class);

        return [
            'domain' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i',
                Rule::unique('institutional_domains', 'domain'),
                function (string $attribute, mixed $value, Closure $fail) use ($service): void {
                    if (is_string($value) && $service->isBlockedPublicDomain($value)) {
                        $fail('Public email providers cannot be whitelisted.');
                    }
                },
            ],
            'institution_name' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'max_users' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
