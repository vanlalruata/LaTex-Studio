<?php

namespace App\Http\Requests\PublicSite;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactEnquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:180'],
            'organization' => ['nullable', 'string', 'max:160'],
            'role' => ['nullable', 'string', 'max:120'],
            'category' => [
                'required',
                'string',
                Rule::in([
                    'general',
                    'product_enquiry',
                    'institutional_deployment',
                    'technical_support',
                    'partnership',
                    'other',
                ]),
            ],
            'subject' => ['required', 'string', 'max:180'],
            'message' => ['required', 'string', 'min:10', 'max:4000'],
            'source_page' => ['nullable', 'string', 'max:120'],
            'website' => ['nullable', 'string', 'max:255'],
        ];
    }
}
