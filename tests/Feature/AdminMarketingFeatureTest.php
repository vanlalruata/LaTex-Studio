<?php

use App\Models\MarketingFeature;
use App\Models\User;
use App\Services\PublicSite\MarketingCatalog;
use Database\Seeders\MarketingFeatureSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

function marketingAdmin(): User
{
    $role = Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin = User::factory()->create();
    $admin->assignRole($role);

    return $admin;
}

test('marketing feature management requires an administrator', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.public-site.features.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('admin.public-site.features.store'), [])
        ->assertForbidden();
});

test('administrator can create a feature and it appears in the public catalog', function () {
    $admin = marketingAdmin();

    $this->actingAs($admin)
        ->post(route('admin.public-site.features.store'), [
            'slug' => 'visual-table-builder',
            'title' => 'Visual table builder',
            'summary' => 'Create editable LaTeX tables with a guided editor.',
            'description' => 'A planned visual tool that produces source users can inspect and modify.',
            'category' => 'Visual authoring tools',
            'availability_status' => 'planned',
            'icon_key' => 'layout',
            'is_featured' => false,
            'is_public' => true,
            'sort_order' => 30,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('marketing_features', [
        'slug' => 'visual-table-builder',
        'availability_status' => 'planned',
        'is_public' => true,
    ]);

    $this->get(route('public.features'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Features')
            ->where('features.0.slug', 'visual-table-builder')
            ->where('features.0.status', 'planned')
        );
});

test('administrator can update and delete a marketing feature', function () {
    $admin = marketingAdmin();
    $feature = MarketingFeature::factory()->create([
        'availability_status' => 'planned',
        'is_public' => true,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.public-site.features.update', $feature), [
            'slug' => $feature->slug,
            'title' => 'Verified authoring feature',
            'summary' => 'This capability is now available.',
            'description' => 'The product owner verified this capability in the current release.',
            'category' => 'Writing environment',
            'availability_status' => 'available',
            'icon_key' => 'code',
            'is_featured' => true,
            'is_public' => false,
            'sort_order' => 10,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('marketing_features', [
        'id' => $feature->id,
        'availability_status' => 'available',
        'is_public' => false,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.public-site.features.destroy', $feature))
        ->assertRedirect();

    $this->assertDatabaseMissing('marketing_features', ['id' => $feature->id]);
    $this->assertDatabaseHas('audit_events', ['action' => 'marketing_feature.deleted']);
});

test('public feature catalog omits private and disabled entries', function () {
    MarketingFeature::factory()->create([
        'slug' => 'public-planned',
        'availability_status' => 'planned',
        'is_public' => true,
    ]);
    MarketingFeature::factory()->create([
        'slug' => 'private-feature',
        'availability_status' => 'available',
        'is_public' => false,
    ]);
    MarketingFeature::factory()->create([
        'slug' => 'disabled-feature',
        'availability_status' => 'disabled',
        'is_public' => true,
    ]);

    $this->get(route('public.features'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('features', 1)
            ->where('features.0.slug', 'public-planned')
        );
});

test('marketing feature seeder is repeatable and preserves admin edits', function () {
    $seeder = app(MarketingFeatureSeeder::class);
    $seeder->run();

    $feature = MarketingFeature::query()->where('slug', 'latex-workspace')->firstOrFail();
    $feature->update(['title' => 'Admin approved title']);
    $initialCount = MarketingFeature::query()->count();

    $seeder->run();

    expect(MarketingFeature::query()->count())->toBe($initialCount)
        ->and($feature->fresh()->title)->toBe('Admin approved title')
        ->and(app(MarketingCatalog::class)->features())->toHaveCount($initialCount);
});
