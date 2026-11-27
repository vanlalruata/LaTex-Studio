<?php

use App\Models\InstitutionalDomain;
use App\Models\User;
use App\Services\InstitutionalAccessService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('extracts domain from email and rejects blocked public domains', function (): void {
    $service = app(InstitutionalAccessService::class);

    expect($service->extractDomain('Someone@MZU.EDU.IN'))->toBe('mzu.edu.in')
        ->and($service->extractDomain('invalid-email'))->toBe('')
        ->and($service->isBlockedPublicDomain('gmail.com'))->toBeTrue()
        ->and($service->isBlockedPublicDomain('mzu.edu.in'))->toBeFalse();
});

test('matches active institutional domain and grants access', function (): void {
    $domain = InstitutionalDomain::query()->create([
        'domain' => 'mzu.edu.in',
        'institution_name' => 'Mizoram University',
        'is_active' => true,
    ]);

    $service = app(InstitutionalAccessService::class);
    $matched = $service->findMatchingDomain('researcher@mzu.edu.in');

    expect($matched)->not->toBeNull()
        ->and($matched?->id)->toBe($domain->id)
        ->and($service->isEligible('researcher@mzu.edu.in'))->toBeTrue()
        ->and($service->isEligible('outsider@gmail.com'))->toBeFalse();

    $user = User::factory()->create(['email' => 'researcher@mzu.edu.in']);
    $service->grant($user, $domain);
    $user->refresh();

    expect($user->is_institutional_free)->toBeTrue()
        ->and($user->institutional_domain)->toBe('mzu.edu.in')
        ->and($user->institutional_granted_at)->not->toBeNull()
        ->and($service->usageCount($domain))->toBe(1);
});

test('ignores inactive, expired, or full institutional domains', function (): void {
    $service = app(InstitutionalAccessService::class);

    InstitutionalDomain::query()->create([
        'domain' => 'inactive.edu',
        'is_active' => false,
    ]);

    InstitutionalDomain::query()->create([
        'domain' => 'expired.edu',
        'is_active' => true,
        'expires_at' => now()->subDay(),
    ]);

    $capped = InstitutionalDomain::query()->create([
        'domain' => 'capped.edu',
        'is_active' => true,
        'max_users' => 1,
    ]);

    $existing = User::factory()->create(['email' => 'first@capped.edu']);
    $service->grant($existing, $capped);

    expect($service->isEligible('user@inactive.edu'))->toBeFalse()
        ->and($service->isEligible('user@expired.edu'))->toBeFalse()
        ->and($service->isEligible('second@capped.edu'))->toBeFalse();
});
