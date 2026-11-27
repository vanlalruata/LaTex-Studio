<?php

use App\Models\AuditEvent;
use App\Models\InstitutionalDomain;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
});

test('non-admin users cannot access institutional domain management', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.institutional-domains.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('admin.institutional-domains.store'), ['domain' => 'mzu.edu.in'])
        ->assertForbidden();
});

test('admin can create, update, bulk-grant, and delete institutional domains', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $existingMzuUser = User::factory()->create([
        'email' => 'faculty@mzu.edu.in',
        'is_institutional_free' => false,
    ]);

    // Reject public email providers
    $this->actingAs($admin)
        ->post(route('admin.institutional-domains.store'), [
            'domain' => 'gmail.com',
            'institution_name' => 'Gmail',
        ])
        ->assertSessionHasErrors('domain');

    // Create mzu.edu.in
    $this->actingAs($admin)
        ->post(route('admin.institutional-domains.store'), [
            'domain' => '@MZU.EDU.IN',
            'institution_name' => 'Mizoram University',
            'max_users' => 500,
        ])
        ->assertRedirect();

    $domain = InstitutionalDomain::query()->where('domain', 'mzu.edu.in')->firstOrFail();
    expect($domain->institution_name)->toBe('Mizoram University')
        ->and($domain->max_users)->toBe(500);

    // Bulk grant to existing matching users
    $this->actingAs($admin)
        ->post(route('admin.institutional-domains.bulk-grant', $domain))
        ->assertRedirect();

    $existingMzuUser->refresh();
    expect($existingMzuUser->is_institutional_free)->toBeTrue()
        ->and($existingMzuUser->institutional_domain)->toBe('mzu.edu.in');

    // Update active state
    $this->actingAs($admin)
        ->put(route('admin.institutional-domains.update', $domain), [
            'institution_name' => 'Mizoram University (Central)',
            'is_active' => false,
        ])
        ->assertRedirect();

    $domain->refresh();
    expect($domain->is_active)->toBeFalse()
        ->and($domain->institution_name)->toBe('Mizoram University (Central)');

    // Delete domain; existing users retain grandfathered access
    $this->actingAs($admin)
        ->delete(route('admin.institutional-domains.destroy', $domain))
        ->assertRedirect();

    $existingMzuUser->refresh();
    expect(InstitutionalDomain::query()->find($domain->id))->toBeNull()
        ->and($existingMzuUser->is_institutional_free)->toBeTrue()
        ->and(AuditEvent::query()->where('action', 'admin.institutional_domain.bulk_granted')->exists())->toBeTrue();
});
