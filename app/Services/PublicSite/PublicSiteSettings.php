<?php

namespace App\Services\PublicSite;

use Laravel\Fortify\Features;

class PublicSiteSettings
{
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
        return [
            'brandName' => (string) config('app.name', 'LaTeX Studio'),
            'tagline' => 'Research writing, from source to finished paper.',
            'registrationMode' => $this->registrationMode(),
            'pricingVisible' => false,
            'contactFormEnabled' => true,
            'supportEmail' => null,
            'announcement' => null,
        ];
    }

    /**
     * Determine the active registration mode from Fortify configuration.
     *
     * @return 'open'|'waitlist'|'invite_only'|'closed'
     */
    public function registrationMode(): string
    {
        if (Features::enabled(Features::registration())) {
            return 'open';
        }

        return 'closed';
    }
}
