<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Services\PublicSite\MarketingCatalog;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function __invoke(MarketingCatalog $catalog): Response
    {
        return Inertia::render('Public/Faq', [
            'faqs' => $catalog->faqs(),
        ]);
    }
}
