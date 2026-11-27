<?php

use App\Models\AuditEvent;
use App\Models\User;
use App\Services\Compiler\CompilerAdapterFactory;
use App\Services\Compiler\CompilerSettingsService;
use App\Services\Compiler\DockerTexLiveAdapter;
use App\Services\Compiler\LocalTexLiveAdapter;
use Illuminate\Support\Facades\Process;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
});

test('non-admin users cannot access compiler settings', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.compiler.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('admin.compiler.update'), ['driver' => 'local'])
        ->assertForbidden();

    $this->actingAs($user)
        ->postJson(route('admin.compiler.test'))
        ->assertForbidden();
});

test('admin can view and update compiler driver between docker and local', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Process::fake([
        '*' => Process::result(output: '', exitCode: 1),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.compiler.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->put(route('admin.compiler.update'), [
            'driver' => 'local',
            'docker_image' => 'latexstudio/texlive-worker:2025',
            'docker_memory_mb' => 2048,
            'docker_cpus' => 2,
            'docker_pids_limit' => 128,
            'local_texlive_bin_path' => '/usr/local/texlive/2025/bin/x86_64-linux',
            'local_latexmk_path' => '/usr/bin/latexmk',
            'wall_timeout' => 90,
            'max_output_mb' => 150,
        ])
        ->assertRedirect();

    $settings = app(CompilerSettingsService::class)->all();

    expect($settings['driver'])->toBe('local')
        ->and($settings['docker_image'])->toBe('latexstudio/texlive-worker:2025')
        ->and($settings['docker_memory_mb'])->toBe(2048)
        ->and($settings['wall_timeout'])->toBe(90)
        ->and(app(CompilerAdapterFactory::class)->resolve())->toBeInstanceOf(LocalTexLiveAdapter::class);

    $audit = AuditEvent::query()->where('action', 'compiler.settings_updated')->first();
    expect($audit)->not->toBeNull()
        ->and($audit?->metadata['driver'])->toBe('local');

    // Switch back to docker
    $this->actingAs($admin)
        ->put(route('admin.compiler.update'), [
            'driver' => 'docker',
            'docker_image' => 'latexstudio/texlive-worker:latest',
            'docker_memory_mb' => 1024,
            'docker_cpus' => 1,
            'docker_pids_limit' => 64,
            'local_texlive_bin_path' => '',
            'local_latexmk_path' => 'latexmk',
            'wall_timeout' => 60,
            'max_output_mb' => 100,
        ])
        ->assertRedirect();

    expect(app(CompilerAdapterFactory::class)->resolve())->toBeInstanceOf(DockerTexLiveAdapter::class);
});

test('admin can run test compilation health check', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Process::fake([
        '*' => Process::result(output: '', errorOutput: 'No TeX Live installed', exitCode: 1),
    ]);

    $this->actingAs($admin)
        ->postJson(route('admin.compiler.test'), ['driver' => 'local'])
        ->assertOk()
        ->assertJsonStructure(['ok', 'driver', 'duration_ms', 'message'])
        ->assertJsonPath('driver', 'local');
});
