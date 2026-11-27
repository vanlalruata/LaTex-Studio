<?php

namespace App\Services;

use App\Models\InstitutionalDomain;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

class InstitutionalAccessService
{
    /** @var list<string> */
    private const BLOCKED_PUBLIC_DOMAINS = [
        'gmail.com',
        'yahoo.com',
        'hotmail.com',
        'outlook.com',
        'live.com',
        'aol.com',
        'protonmail.com',
        'icloud.com',
        'mail.com',
        'yandex.com',
        'zoho.com',
    ];

    public function extractDomain(string $email): string
    {
        $trimmed = strtolower(trim($email));
        $atPos = strrpos($trimmed, '@');

        if ($atPos === false) {
            return '';
        }

        return substr($trimmed, $atPos + 1);
    }

    public function isBlockedPublicDomain(string $domain): bool
    {
        return in_array(strtolower(trim($domain)), self::BLOCKED_PUBLIC_DOMAINS, true);
    }

    public function findMatchingDomain(string $email): ?InstitutionalDomain
    {
        if (! Schema::hasTable('institutional_domains')) {
            return null;
        }

        $domainName = $this->extractDomain($email);

        if ($domainName === '' || $this->isBlockedPublicDomain($domainName)) {
            return null;
        }

        $domain = InstitutionalDomain::query()
            ->where('domain', $domainName)
            ->where('is_active', true)
            ->where(function ($query): void {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->first();

        if ($domain === null) {
            return null;
        }

        if ($domain->max_users !== null && $this->usageCount($domain) >= $domain->max_users) {
            return null;
        }

        return $domain;
    }

    public function isEligible(string $email): bool
    {
        return $this->findMatchingDomain($email) !== null;
    }

    public function grant(User $user, InstitutionalDomain $domain): void
    {
        $user->forceFill([
            'is_institutional_free' => true,
            'institutional_domain' => $domain->domain,
            'institutional_granted_at' => now(),
        ])->save();
    }

    public function usageCount(InstitutionalDomain $domain): int
    {
        return User::query()
            ->where('is_institutional_free', true)
            ->where('institutional_domain', $domain->domain)
            ->count();
    }
}
