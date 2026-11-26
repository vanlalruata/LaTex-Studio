<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Services\PublicSite\MarketingCatalog;
use Inertia\Inertia;
use Inertia\Response;

class FeatureController extends Controller
{
    public function __invoke(MarketingCatalog $catalog): Response
    {
        return Inertia::render('Public/Features', [
            'features' => $catalog->features(),
        ]);
    }
}
