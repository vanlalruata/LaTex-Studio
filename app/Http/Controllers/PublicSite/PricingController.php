<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Services\PublicSite\PublicPricingVisibility;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    public function __invoke(PublicPricingVisibility $pricingVisibility): Response
    {
        $pricing = $pricingVisibility->resolve();

        if (! $pricing['visible']) {
            abort(404);
        }

        return Inertia::render('Public/Pricing', [
            'plans' => $pricing['plans'],
            'mode' => $pricing['mode'],
            'taxNote' => $pricing['taxNote'],
        ]);
    }
}
