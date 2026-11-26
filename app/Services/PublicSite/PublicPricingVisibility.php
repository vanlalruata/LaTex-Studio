<?php

namespace App\Services\PublicSite;

use App\Models\PricingPlan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class PublicPricingVisibility
{
    public const CACHE_KEY = 'public_site.pricing_visibility';

    public function __construct(
        private readonly PublicSiteSettings $settings,
    ) {}

    /**
     * Single source of truth for public pricing visibility.
     *
     * @return array{
     *     visible: bool,
     *     mode: 'free'|'paid'|'contact_sales',
     *     taxNote: string|null,
     *     plans: list<array{
     *         slug: string,
     *         name: string,
     *         summary: string|null,
     *         priceAmount: int,
     *         currency: string,
     *         billingInterval: string,
     *         features: list<string>,
     *         ctaLabel: string,
     *         ctaType: string,
     *         ctaTarget: string|null
     *     }>
     * }
     */
    public function resolve(): array
    {
        $rawMode = $this->settings->get('pricing_mode', 'free');
        $mode = in_array($rawMode, ['free', 'paid', 'contact_sales'], true) ? $rawMode : 'free';
        $pageEnabled = (bool) $this->settings->get('pricing_page_enabled', false);
        $rawTaxNote = $this->settings->get('pricing_tax_note');
        $taxNote = is_string($rawTaxNote) && $rawTaxNote !== '' ? $rawTaxNote : null;

        if ($mode === 'free' || ! $pageEnabled || ! Schema::hasTable('pricing_plans')) {
            return [
                'visible' => false,
                'mode' => $mode,
                'taxNote' => null,
                'plans' => [],
            ];
        }

        /** @var list<array{
         *     slug: string,
         *     name: string,
         *     summary: string|null,
         *     priceAmount: int,
         *     currency: string,
         *     billingInterval: string,
         *     features: list<string>,
         *     ctaLabel: string,
         *     ctaType: string,
         *     ctaTarget: string|null
         * }> $plans */
        $plans = Cache::remember(self::CACHE_KEY, now()->addMinutes(30), static function (): array {
            return PricingPlan::query()
                ->where('is_active', true)
                ->where('is_public', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(static function (PricingPlan $plan): array {
                    $features = array_values(array_filter(
                        is_array($plan->features) ? $plan->features : [],
                        static fn (string $item): bool => $item !== ''
                    ));

                    return [
                        'slug' => $plan->slug,
                        'name' => $plan->name,
                        'summary' => $plan->summary,
                        'priceAmount' => $plan->price_amount,
                        'currency' => $plan->currency,
                        'billingInterval' => $plan->billing_interval,
                        'features' => $features,
                        'ctaLabel' => $plan->cta_label,
                        'ctaType' => $plan->cta_type,
                        'ctaTarget' => $plan->cta_target,
                    ];
                })
                ->values()
                ->all();
        });

        if ($plans === []) {
            return [
                'visible' => false,
                'mode' => $mode,
                'taxNote' => null,
                'plans' => [],
            ];
        }

        return [
            'visible' => true,
            'mode' => $mode,
            'taxNote' => $taxNote,
            'plans' => $plans,
        ];
    }
}
