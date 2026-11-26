<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Services\PublicSite\MarketingCatalog;
use App\Services\PublicSite\PublicPricingVisibility;
use App\Services\PublicSite\PublicSiteSettings;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Render the public landing page.
     */
    public function __invoke(
        MarketingCatalog $catalog,
        PublicSiteSettings $settings,
        PublicPricingVisibility $pricingVisibility,
    ): Response {
        $pricing = $pricingVisibility->resolve();

        return Inertia::render('Public/Home', [
            'canRegister' => $settings->registrationMode() === 'open',
            'features' => $catalog->featuredFeatures(),
            'faqs' => array_slice($catalog->faqs(), 0, 4),
            'pricingPlans' => $pricing['visible'] ? $pricing['plans'] : [],
        ]);
    }
}
