<?php

use App\Models\InstitutionalDomain;
use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function (): void {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('user registering with whitelisted institutional email is automatically granted free access', function (): void {
    InstitutionalDomain::query()->create([
        'domain' => 'mzu.edu.in',
        'institution_name' => 'Mizoram University',
        'is_active' => true,
    ]);

    $response = $this->post(route('register.store'), [
        'name' => 'Dr. MZU Researcher',
        'email' => 'someone@mzu.edu.in',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::query()->where('email', 'someone@mzu.edu.in')->firstOrFail();

    expect($user->is_institutional_free)->toBeTrue()
        ->and($user->institutional_domain)->toBe('mzu.edu.in')
        ->and($user->institutional_granted_at)->not->toBeNull();
});

test('user registering with non-institutional email does not receive free institutional access', function (): void {
    InstitutionalDomain::query()->create([
        'domain' => 'mzu.edu.in',
        'institution_name' => 'Mizoram University',
        'is_active' => true,
    ]);

    $this->post(route('register.store'), [
        'name' => 'Standard User',
        'email' => 'someone@gmail.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();

    $user = User::query()->where('email', 'someone@gmail.com')->firstOrFail();

    expect($user->is_institutional_free)->toBeFalse()
        ->and($user->institutional_domain)->toBeNull();
});

test('user registering when institutional domain is at capacity does not receive auto-grant', function (): void {
    InstitutionalDomain::query()->create([
        'domain' => 'mzu.edu.in',
        'institution_name' => 'Mizoram University',
        'is_active' => true,
        'max_users' => 1,
    ]);

    User::factory()->create([
        'email' => 'first@mzu.edu.in',
        'is_institutional_free' => true,
        'institutional_domain' => 'mzu.edu.in',
    ]);

    $this->post(route('register.store'), [
        'name' => 'Second User',
        'email' => 'second@mzu.edu.in',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $second = User::query()->where('email', 'second@mzu.edu.in')->firstOrFail();

    expect($second->is_institutional_free)->toBeFalse()
        ->and($second->institutional_domain)->toBeNull();
});
