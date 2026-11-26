<?php

use App\Enums\CompilationStatus;
use App\Models\AiAction;
use App\Models\AuditEvent;
use App\Models\BibliographySource;
use App\Models\ChangeSuggestion;
use App\Models\Comment;
use App\Models\CommentThread;
use App\Models\ContactEnquiry;
use App\Models\ConversionJob;
use App\Models\DocumentAnnotation;
use App\Models\OcrJob;
use App\Models\PricingPlan;
use App\Models\Project;
use App\Models\ProjectChatMessage;
use App\Models\ProjectIntegration;
use App\Models\ProjectMilestone;
use App\Models\ProjectTask;
use App\Models\ResearchAsset;
use App\Models\ReviewAssignment;
use App\Models\Template;
use App\Models\UsageRecord;
use App\Models\UserAiCredential;
use App\Services\PublicSite\PublicPricingVisibility;
use Database\Seeders\ProjectSeeder;
use Illuminate\Support\Facades\Storage;

test('demo seeders populate every workspace feature', function (): void {
    Storage::fake('local');

    $this->seed();

    $project = Project::query()
        ->where('title', ProjectSeeder::DEMO_PROJECT_TITLE)
        ->firstOrFail();

    expect($project->files()->count())->toBe(14)
        ->and($project->revisions()->count())->toBe(2)
        ->and($project->compilations()->count())->toBe(4);

    $published = $project->lastSuccessfulCompilation;

    expect($published)->not->toBeNull()
        ->and($published->status)->toBe(CompilationStatus::Published);

    $this->actingAs($project->owner)
        ->get(route('compilations.artifacts.show', [$published, 'pdf']))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');

    expect(CommentThread::count())->toBe(3)
        ->and(Comment::count())->toBe(5)
        ->and(ChangeSuggestion::count())->toBe(3)
        ->and(ProjectChatMessage::count())->toBe(5)
        ->and(ReviewAssignment::count())->toBe(3)
        ->and(DocumentAnnotation::count())->toBe(3)
        ->and(ResearchAsset::count())->toBe(6)
        ->and(BibliographySource::count())->toBe(4)
        ->and(OcrJob::count())->toBe(2)
        ->and(ConversionJob::count())->toBe(3)
        ->and(ProjectMilestone::count())->toBe(3)
        ->and(ProjectTask::count())->toBe(8)
        ->and(ProjectIntegration::count())->toBe(3)
        ->and(AiAction::count())->toBe(4)
        ->and(UserAiCredential::count())->toBe(0)
        ->and(AuditEvent::count())->toBe(10)
        ->and(UsageRecord::count())->toBe(48)
        ->and(ContactEnquiry::count())->toBe(2)
        ->and(Template::count())->toBe(5)
        ->and(Project::count())->toBe(2);

    $visibility = app(PublicPricingVisibility::class)->resolve();

    expect($visibility['visible'])->toBeTrue()
        ->and($visibility['plans'])->toHaveCount(3)
        ->and(PricingPlan::count())->toBe(4)
        ->and(PricingPlan::query()->where('is_active', true)->where('is_public', true)->count())->toBe(3);
});
