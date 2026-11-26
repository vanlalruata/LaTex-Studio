<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Services\PublicSite\PublicSiteSettings;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Render the public landing page.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Public/Home', [
            'canRegister' => app(PublicSiteSettings::class)->registrationMode() === 'open',
        ]);
    }
}
