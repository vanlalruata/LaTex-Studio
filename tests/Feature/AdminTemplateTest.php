<?php

use App\Models\Template;
use App\Models\User;
use Spatie\Permission\Models\Role;

function templateAdminUser(): User
{
    $role = Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin = User::factory()->create();
    $admin->assignRole($role);

    return $admin;
}

function templatePayload(array $overrides = []): array
{
    return array_merge([
        'slug' => 'admin-template-'.uniqid(),
        'title' => 'Admin Research Template',
        'category' => 'article',
        'description' => 'A source starter managed by an administrator.',
        'compiler_engine' => 'pdflatex',
        'files_manifest' => [
            ['path' => 'main.tex', 'content' => "\\documentclass{article}\n\\begin{document}\nDraft\n\\end{document}\n"],
            ['path' => 'sections/intro.tex', 'content' => "\\section{Introduction}\n"],
        ],
        'is_public' => true,
    ], $overrides);
}

test('only administrators can manage templates', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.public-site.templates.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('admin.public-site.templates.store'), templatePayload())
        ->assertForbidden();
});

test('administrator can create and publish a multi-file template', function () {
    $admin = templateAdminUser();
    $payload = templatePayload(['slug' => 'admin-research-article']);

    $this->actingAs($admin)
        ->post(route('admin.public-site.templates.store'), $payload)
        ->assertRedirect();

    $template = Template::query()->where('slug', 'admin-research-article')->firstOrFail();

    expect($template->files_manifest)->toHaveCount(2)
        ->and($template->files_manifest[1]['path'])->toBe('sections/intro.tex');

    $this->get(route('public.templates'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Public/Templates')
            ->where('templates.0.slug', 'admin-research-article')
        );

    $this->assertDatabaseHas('audit_events', ['action' => 'template.created']);
});

test('template manifest rejects traversal paths and duplicate normalized paths', function () {
    $admin = templateAdminUser();

    $this->actingAs($admin)
        ->from(route('admin.public-site.templates.index'))
        ->post(route('admin.public-site.templates.store'), templatePayload([
            'files_manifest' => [
                ['path' => '../escape.tex', 'content' => 'unsafe'],
            ],
        ]))
        ->assertSessionHasErrors('files_manifest.0.path');

    $this->actingAs($admin)
        ->from(route('admin.public-site.templates.index'))
        ->post(route('admin.public-site.templates.store'), templatePayload([
            'files_manifest' => [
                ['path' => 'chapters//intro.tex', 'content' => 'one'],
                ['path' => 'chapters/intro.tex', 'content' => 'two'],
            ],
        ]))
        ->assertSessionHasErrors('files_manifest.1.path');
});

test('administrator can edit publication settings and delete a template', function () {
    $admin = templateAdminUser();
    $template = Template::factory()->create([
        'slug' => 'private-admin-template',
        'is_public' => false,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.public-site.templates.update', $template), templatePayload([
            'slug' => $template->slug,
            'title' => 'Published starter',
            'is_public' => true,
        ]))
        ->assertRedirect();

    $this->assertDatabaseHas('templates', [
        'id' => $template->id,
        'title' => 'Published starter',
        'is_public' => true,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.public-site.templates.destroy', $template))
        ->assertRedirect();

    $this->assertDatabaseMissing('templates', ['id' => $template->id]);
    $this->assertDatabaseHas('audit_events', ['action' => 'template.deleted']);
});
