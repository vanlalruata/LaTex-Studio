<?php

namespace App\Services\PublicSite;

use App\Models\PublicSiteSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Laravel\Fortify\Features;

class PublicSiteSettings
{
    public const CACHE_KEY = 'public_site.settings';

    /**
     * @return array<string, mixed>
     */
    public function all(): array
    {
        $defaults = $this->defaults();

        if (! Schema::hasTable('public_site_settings')) {
            return $defaults;
        }

        /** @var array<string, mixed> $stored */
        $stored = Cache::remember(self::CACHE_KEY, now()->addMinutes(30), static function (): array {
            return PublicSiteSetting::query()
                ->pluck('value', 'key')
                ->all();
        });

        return array_merge($defaults, $stored);
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $all = $this->all();

        return $all[$key] ?? $default;
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public function updateMany(array $values): void
    {
        foreach ($values as $key => $value) {
            PublicSiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }

        $this->forgetCache();
    }

    public function forgetCache(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget(PublicPricingVisibility::CACHE_KEY);
    }

    /**
     * Return only allowlisted, non-sensitive configuration for public Inertia pages.
     *
     * @return array{
     *     brandName: string,
     *     tagline: string,
     *     registrationMode: 'open'|'waitlist'|'invite_only'|'closed',
     *     pricingVisible: bool,
     *     contactFormEnabled: bool,
     *     supportEmail: string|null,
     *     announcement: array{text: string, href?: string}|null
     * }
     */
    public function toSharedProps(): array
    {
        $settings = $this->all();
        $pricing = app(PublicPricingVisibility::class)->resolve();

        $brandName = is_string($settings['public_brand_name'] ?? null) && $settings['public_brand_name'] !== ''
            ? $settings['public_brand_name']
            : (string) config('app.name', 'LaTeX Studio');

        $tagline = is_string($settings['public_tagline'] ?? null) && $settings['public_tagline'] !== ''
            ? $settings['public_tagline']
            : 'Research writing, from source to finished paper.';

        $supportEmail = is_string($settings['public_support_email'] ?? null) && $settings['public_support_email'] !== ''
            ? $settings['public_support_email']
            : null;

        $announcementText = is_string($settings['public_announcement'] ?? null) && $settings['public_announcement'] !== ''
            ? $settings['public_announcement']
            : null;

        return [
            'brandName' => $brandName,
            'tagline' => $tagline,
            'registrationMode' => $this->registrationMode(),
            'pricingVisible' => $pricing['visible'],
            'contactFormEnabled' => (bool) ($settings['contact_form_enabled'] ?? true),
            'supportEmail' => $supportEmail,
            'announcement' => $announcementText !== null ? ['text' => $announcementText] : null,
        ];
    }

    /**
     * Determine the active registration mode from settings and Fortify configuration.
     *
     * @return 'open'|'waitlist'|'invite_only'|'closed'
     */
    public function registrationMode(): string
    {
        if (! Features::enabled(Features::registration())) {
            return 'closed';
        }

        $configured = $this->get('registration_mode', 'open');
        if (in_array($configured, ['open', 'waitlist', 'invite_only', 'closed'], true)) {
            return $configured;
        }

        return 'open';
    }

    /**
     * @return array<string, mixed>
     */
    private function defaults(): array
    {
        return [
            'pricing_mode' => 'free',
            'pricing_page_enabled' => false,
            'pricing_currency' => 'USD',
            'pricing_tax_note' => null,
            'registration_mode' => 'open',
            'public_site_enabled' => true,
            'contact_form_enabled' => true,
            'contact_notification_email' => null,
            'public_brand_name' => config('app.name', 'LaTeX Studio'),
            'public_tagline' => 'Research writing, from source to finished paper.',
            'public_support_email' => null,
            'public_announcement' => null,
        ];
    }
}
