<?php

namespace Database\Seeders;

use App\Models\ContactEnquiry;
use App\Models\PricingPlan;
use App\Models\User;
use App\Services\PublicSite\PublicSiteSettings;
use Illuminate\Database\Seeder;

class PublicSiteSeeder extends Seeder
{
    public function run(): void
    {
        app(PublicSiteSettings::class)->updateMany([
            'pricing_mode' => 'paid',
            'pricing_page_enabled' => true,
            'pricing_currency' => 'USD',
            'pricing_tax_note' => 'Prices exclude applicable taxes.',
            'registration_mode' => 'open',
            'public_site_enabled' => true,
            'contact_form_enabled' => true,
            'contact_notification_email' => 'hello@latexstudio.com',
            'public_brand_name' => 'LaTeX Studio',
            'public_tagline' => 'Write, review, and typeset research in one workspace.',
            'public_support_email' => 'support@latexstudio.com',
            'public_announcement' => 'New: project tasks, review assignments, and build history are now in preview.',
        ]);

        $plans = [
            [
                'slug' => 'free',
                'name' => 'Free',
                'summary' => 'For individual papers and coursework.',
                'price_amount' => 0,
                'billing_interval' => 'month',
                'features' => [
                    'One active project',
                    '50 compilations per month',
                    'Comments, chat, and version history',
                    'Community templates',
                ],
                'cta_label' => 'Start writing',
                'cta_type' => 'register',
                'cta_target' => null,
                'is_active' => true,
                'is_public' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'scholar',
                'name' => 'Scholar',
                'summary' => 'For active researchers shipping papers.',
                'price_amount' => 1200,
                'billing_interval' => 'month',
                'features' => [
                    'Unlimited projects and revisions',
                    '1,000 compilations per month',
                    'XeLaTeX and LuaLaTeX engines',
                    'AI writing review with your own API key',
                    'Figure, table, and equation builders',
                    'Priority build queue',
                ],
                'cta_label' => 'Choose Scholar',
                'cta_type' => 'register',
                'cta_target' => null,
                'is_active' => true,
                'is_public' => true,
                'sort_order' => 2,
            ],
            [
                'slug' => 'lab',
                'name' => 'Lab',
                'summary' => 'For research groups and institutional writing labs.',
                'price_amount' => 4900,
                'billing_interval' => 'month',
                'features' => [
                    'Everything in Scholar',
                    'Shared organization workspace',
                    'Review assignments and milestones',
                    'OCR and document conversion credits',
                    'Usage analytics and audit history',
                    'SAML-ready access controls on the roadmap',
                ],
                'cta_label' => 'Talk to sales',
                'cta_type' => 'contact',
                'cta_target' => null,
                'is_active' => true,
                'is_public' => true,
                'sort_order' => 3,
            ],
            [
                'slug' => 'archive',
                'name' => 'Archive',
                'summary' => 'Retired plan kept for historical invoices.',
                'price_amount' => 2900,
                'billing_interval' => 'month',
                'features' => [
                    'Read-only project access',
                    'Artifact retention for twelve months',
                ],
                'cta_label' => 'Contact support',
                'cta_type' => 'contact',
                'cta_target' => null,
                'is_active' => false,
                'is_public' => false,
                'sort_order' => 9,
            ],
        ];

        foreach ($plans as $plan) {
            PricingPlan::query()->updateOrCreate(
                ['slug' => $plan['slug']],
                $plan + ['currency' => 'USD']
            );
        }

        $admin = User::query()->where('email', 'admin@latexstudio.com')->first();

        ContactEnquiry::query()->updateOrCreate(
            [
                'email' => 'lucia.moreno@northvalley.edu',
                'subject' => 'Institutional deployment for a 40-seat writing lab',
            ],
            [
                'name' => 'Lucia Moreno',
                'organization' => 'North Valley University',
                'role' => 'Research Computing Lead',
                'category' => 'institutional_deployment',
                'message' => 'We are evaluating LaTeX Studio for a 40-seat graduate writing lab. Could you share SSO options and a sample academic license?',
                'status' => 'new',
                'source_page' => '/pricing',
                'handled_by' => null,
                'handled_at' => null,
            ]
        );

        ContactEnquiry::query()->updateOrCreate(
            [
                'email' => 'kwame.mensah@aquifer-analytics.com',
                'subject' => 'Pandoc conversion for legacy Word manuscripts',
            ],
            [
                'name' => 'Kwame Mensah',
                'organization' => 'Aquifer Analytics',
                'role' => 'Principal Data Scientist',
                'category' => 'technical_support',
                'message' => 'Our team maintains about 120 Word manuscripts that we would like to convert to LaTeX without losing equations or figure references.',
                'status' => 'in_progress',
                'source_page' => '/contact',
                'handled_by' => $admin?->id,
                'handled_at' => $admin !== null ? now()->subDay() : null,
            ]
        );
    }
}
