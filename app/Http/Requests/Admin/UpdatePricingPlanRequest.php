<?php

namespace App\Http\Requests\Admin;

use App\Models\PricingPlan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePricingPlanRequest extends FormRequest
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
        /** @var PricingPlan|null $plan */
        $plan = $this->route('plan');

        return [
            'name' => ['required', 'string', 'max:80'],
            'slug' => [
                'required',
                'string',
                'max:80',
                'alpha_dash',
                Rule::unique('pricing_plans', 'slug')->ignore($plan?->id),
            ],
            'summary' => ['nullable', 'string', 'max:200'],
            'price_amount' => ['required', 'integer', 'min:0', 'max:100000000'],
            'currency' => ['required', 'string', 'size:3', 'alpha'],
            'billing_interval' => ['required', 'string', Rule::in(['month', 'year', 'one_time', 'custom'])],
            'features' => ['nullable', 'array', 'max:12'],
            'features.*' => ['string', 'max:140'],
            'cta_label' => ['required', 'string', 'max:60'],
            'cta_type' => ['required', 'string', Rule::in(['register', 'contact', 'external', 'none'])],
            'cta_target' => ['nullable', 'url:https', 'max:255'],
            'is_active' => ['required', 'boolean'],
            'is_public' => ['required', 'boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:999'],
        ];
    }
}
