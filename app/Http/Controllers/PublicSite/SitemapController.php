<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Services\PublicSite\PublicPricingVisibility;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(PublicPricingVisibility $pricingVisibility): Response
    {
        $routes = [
            route('home'),
            route('public.features'),
            route('public.how-it-works'),
            route('public.demo'),
            route('public.templates'),
            route('public.about'),
            route('public.contact'),
            route('public.faq'),
            route('public.privacy'),
            route('public.terms'),
        ];

        $pricing = $pricingVisibility->resolve();
        if ($pricing['visible']) {
            $routes[] = route('public.pricing');
        }

        $urls = array_map(
            static fn (string $loc): string => '  <url><loc>'.htmlspecialchars($loc, ENT_XML1 | ENT_QUOTES, 'UTF-8').'</loc></url>',
            $routes
        );

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            ."<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
            .implode("\n", $urls)."\n"
            ."</urlset>\n";

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
