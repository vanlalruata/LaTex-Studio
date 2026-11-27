<?php

use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Models\AuditEvent;
use App\Models\Compilation;
use App\Models\Project;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
});

test('non-admin users cannot access build queue monitor', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.build-queue.index'))
        ->assertForbidden();
});

test('admin can view build queue and force cancel stuck compilation', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $stuck = Compilation::query()->create([
        'project_id' => $project->id,
        'triggered_by' => $owner->id,
        'idempotency_key' => 'stuck-build-1',
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'status' => CompilationStatus::Compiling,
        'started_at' => now()->subMinutes(10),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.build-queue.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('admin.build-queue.cancel', $stuck))
        ->assertRedirect();

    $stuck->refresh();

    expect($stuck->status)->toBe(CompilationStatus::Cancelled)
        ->and($stuck->finished_at)->not->toBeNull()
        ->and(AuditEvent::query()->where('action', 'admin.compilation.force_cancelled')->exists())->toBeTrue();
});
