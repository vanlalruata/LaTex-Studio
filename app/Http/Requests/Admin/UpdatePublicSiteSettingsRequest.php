<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePublicSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage-public-site') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'pricing_mode' => ['required', 'string', Rule::in(['free', 'paid', 'contact_sales'])],
            'pricing_page_enabled' => ['required', 'boolean'],
            'pricing_currency' => ['required', 'string', 'size:3', 'alpha'],
            'pricing_tax_note' => ['nullable', 'string', 'max:255'],
            'registration_mode' => ['required', 'string', Rule::in(['open', 'waitlist', 'invite_only', 'closed'])],
            'contact_form_enabled' => ['required', 'boolean'],
            'contact_notification_email' => ['nullable', 'email:rfc', 'max:255'],
            'public_brand_name' => ['required', 'string', 'max:80'],
            'public_tagline' => ['required', 'string', 'max:180'],
            'public_support_email' => ['nullable', 'email:rfc', 'max:255'],
            'public_announcement' => ['nullable', 'string', 'max:200'],
        ];
    }
}
