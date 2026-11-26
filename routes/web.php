<?php

use App\Http\Controllers\Admin\AuditController as AdminAuditController;
use App\Http\Controllers\Admin\ContactEnquiryController as AdminContactEnquiryController;
use App\Http\Controllers\Admin\MarketingFeatureController as AdminMarketingFeatureController;
use App\Http\Controllers\Admin\OrganizationController as AdminOrganizationController;
use App\Http\Controllers\Admin\OverviewController as AdminOverviewController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\PublicSiteController as AdminPublicSiteController;
use App\Http\Controllers\Admin\TemplateController as AdminTemplateController;
use App\Http\Controllers\Admin\UsageController as AdminUsageController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\AnnotationController;
use App\Http\Controllers\BibliographyController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompilationController;
use App\Http\Controllers\ConversionJobController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FigureController;
use App\Http\Controllers\OcrJobController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\ProjectChatController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ProjectIndexController;
use App\Http\Controllers\ProjectIntegrationController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\ProjectMilestoneController;
use App\Http\Controllers\ProjectRevisionController;
use App\Http\Controllers\ProjectTaskController;
use App\Http\Controllers\PublicSite\AboutController;
use App\Http\Controllers\PublicSite\ContactController;
use App\Http\Controllers\PublicSite\DemoController;
use App\Http\Controllers\PublicSite\FaqController;
use App\Http\Controllers\PublicSite\FeatureController;
use App\Http\Controllers\PublicSite\HomeController;
use App\Http\Controllers\PublicSite\HowItWorksController;
use App\Http\Controllers\PublicSite\LegalController;
use App\Http\Controllers\PublicSite\PricingController;
use App\Http\Controllers\PublicSite\SitemapController;
use App\Http\Controllers\PublicSite\TemplateController;
use App\Http\Controllers\ResearchAssetController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\TableDesignController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::get('/features', FeatureController::class)->name('public.features');
Route::get('/how-it-works', HowItWorksController::class)->name('public.how-it-works');
Route::get('/demo', DemoController::class)->name('public.demo');
Route::get('/templates', TemplateController::class)->name('public.templates');
Route::get('/pricing', PricingController::class)->name('public.pricing');
Route::get('/about', AboutController::class)->name('public.about');
Route::get('/contact', [ContactController::class, 'show'])->name('public.contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact-enquiry')
    ->name('public.contact.store');
Route::get('/faq', FaqController::class)->name('public.faq');
Route::get('/privacy', [LegalController::class, 'privacy'])->name('public.privacy');
Route::get('/terms', [LegalController::class, 'terms'])->name('public.terms');
Route::get('/sitemap.xml', SitemapController::class)->name('public.sitemap');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::patch('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::get('projects/{project}/export', [ProjectController::class, 'export'])->name('projects.export');

    Route::post('projects/{project}/files', [ProjectFileController::class, 'store'])->name('projects.files.store');
    Route::get('projects/{project}/files/{file}', [ProjectFileController::class, 'show'])->name('projects.files.show');
    Route::put('projects/{project}/files/{file}', [ProjectFileController::class, 'update'])->name('projects.files.update');
    Route::delete('projects/{project}/files/{file}', [ProjectFileController::class, 'destroy'])->name('projects.files.destroy');

    Route::get('projects/{project}/revisions', [ProjectRevisionController::class, 'index'])->name('projects.revisions.index');
    Route::post('projects/{project}/revisions', [ProjectRevisionController::class, 'store'])->name('projects.revisions.store');
    Route::get('projects/{project}/revisions/{revision}', [ProjectRevisionController::class, 'show'])->name('projects.revisions.show');
    Route::get('projects/{project}/revisions/{revision}/diff', [ProjectRevisionController::class, 'diff'])->name('projects.revisions.diff');
    Route::post('projects/{project}/revisions/{revision}/restore', [ProjectRevisionController::class, 'restore'])->name('projects.revisions.restore');
    Route::get('projects/{project}/index', ProjectIndexController::class)->name('projects.index');

    Route::post('projects/{project}/compilations', [CompilationController::class, 'store'])->name('projects.compilations.store');
    Route::put('projects/{project}/compiler-engine', [CompilationController::class, 'updateEngine'])->name('projects.engine.update');
    Route::get('compilations/{compilation}', [CompilationController::class, 'show'])->name('compilations.show');
    Route::post('compilations/{compilation}/cancel', [CompilationController::class, 'cancel'])->name('compilations.cancel');
    Route::post('compilations/{compilation}/retry', [CompilationController::class, 'retry'])->name('compilations.retry');
    Route::post('compilations/{compilation}/synctex/forward', [CompilationController::class, 'forwardSynctex'])->name('compilations.synctex.forward');
    Route::post('compilations/{compilation}/synctex/inverse', [CompilationController::class, 'inverseSynctex'])->name('compilations.synctex.inverse');
    Route::get('compilations/{compilation}/artifacts/{type}', [CompilationController::class, 'artifact'])->name('compilations.artifacts.show');

    // Project management: milestones, tasks, integrations
    Route::get('projects/{project}/tasks', [ProjectTaskController::class, 'index'])->name('projects.tasks.index');
    Route::post('projects/{project}/tasks', [ProjectTaskController::class, 'store'])->name('projects.tasks.store');
    Route::patch('projects/{project}/tasks/{task}', [ProjectTaskController::class, 'update'])->name('projects.tasks.update');
    Route::delete('projects/{project}/tasks/{task}', [ProjectTaskController::class, 'destroy'])->name('projects.tasks.destroy');
    Route::get('projects/{project}/milestones', [ProjectMilestoneController::class, 'index'])->name('projects.milestones.index');
    Route::post('projects/{project}/milestones', [ProjectMilestoneController::class, 'store'])->name('projects.milestones.store');
    Route::patch('projects/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'update'])->name('projects.milestones.update');
    Route::delete('projects/{project}/milestones/{milestone}', [ProjectMilestoneController::class, 'destroy'])->name('projects.milestones.destroy');
    Route::get('projects/{project}/integrations', [ProjectIntegrationController::class, 'index'])->name('projects.integrations.index');
    Route::post('projects/{project}/integrations', [ProjectIntegrationController::class, 'store'])->name('projects.integrations.store');
    Route::patch('projects/{project}/integrations/{integration}', [ProjectIntegrationController::class, 'update'])->name('projects.integrations.update');
    Route::delete('projects/{project}/integrations/{integration}', [ProjectIntegrationController::class, 'destroy'])->name('projects.integrations.destroy');

    // Research workspace: assets, bibliography, OCR and conversion queues
    Route::get('projects/{project}/research-assets', [ResearchAssetController::class, 'index'])->name('projects.research-assets.index');
    Route::post('projects/{project}/research-assets', [ResearchAssetController::class, 'store'])->name('projects.research-assets.store');
    Route::delete('projects/{project}/research-assets/{asset}', [ResearchAssetController::class, 'destroy'])->name('projects.research-assets.destroy');
    Route::get('projects/{project}/bibliography', [BibliographyController::class, 'index'])->name('projects.bibliography.index');
    Route::post('projects/{project}/bibliography', [BibliographyController::class, 'store'])->name('projects.bibliography.store');
    Route::delete('projects/{project}/bibliography/{source}', [BibliographyController::class, 'destroy'])->name('projects.bibliography.destroy');
    Route::get('projects/{project}/ocr', [OcrJobController::class, 'index'])->name('projects.ocr.index');
    Route::post('projects/{project}/ocr', [OcrJobController::class, 'store'])->name('projects.ocr.store');
    Route::delete('projects/{project}/ocr/{ocrJob}', [OcrJobController::class, 'destroy'])->name('projects.ocr.destroy');
    Route::get('projects/{project}/conversions', [ConversionJobController::class, 'index'])->name('projects.conversions.index');
    Route::post('projects/{project}/conversions', [ConversionJobController::class, 'store'])->name('projects.conversions.store');
    Route::delete('projects/{project}/conversions/{conversionJob}', [ConversionJobController::class, 'destroy'])->name('projects.conversions.destroy');

    // Annotations and live presence/cursors
    Route::get('projects/{project}/annotations', [AnnotationController::class, 'index'])->name('projects.annotations.index');
    Route::post('projects/{project}/annotations', [AnnotationController::class, 'store'])->name('projects.annotations.store');
    Route::patch('projects/{project}/annotations/{annotation}', [AnnotationController::class, 'update'])->name('projects.annotations.update');
    Route::delete('projects/{project}/annotations/{annotation}', [AnnotationController::class, 'destroy'])->name('projects.annotations.destroy');
    Route::get('projects/{project}/presence', [PresenceController::class, 'index'])->name('projects.presence.index');
    Route::post('projects/{project}/presence', [PresenceController::class, 'store'])->name('projects.presence.store');

    // Phase 8: Collaboration, Comments & Track Changes
    Route::get('projects/{project}/members', [ProjectMemberController::class, 'index'])->name('projects.members.index');
    Route::post('projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
    Route::delete('projects/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])->name('projects.members.destroy');

    Route::get('projects/{project}/comments', [CommentController::class, 'index'])->name('projects.comments.index');
    Route::post('projects/{project}/comments', [CommentController::class, 'store'])->name('projects.comments.store');
    Route::post('projects/{project}/comments/{thread}/reply', [CommentController::class, 'reply'])->name('projects.comments.reply');
    Route::post('projects/{project}/comments/{thread}/resolve', [CommentController::class, 'resolve'])->name('projects.comments.resolve');

    Route::get('projects/{project}/suggestions', [SuggestionController::class, 'index'])->name('projects.suggestions.index');
    Route::post('projects/{project}/suggestions', [SuggestionController::class, 'store'])->name('projects.suggestions.store');
    Route::post('projects/{project}/suggestions/{suggestion}/accept', [SuggestionController::class, 'accept'])->name('projects.suggestions.accept');
    Route::post('projects/{project}/suggestions/{suggestion}/reject', [SuggestionController::class, 'reject'])->name('projects.suggestions.reject');

    // Project Collaborator Chat & Presence
    Route::get('projects/{project}/chat', [ProjectChatController::class, 'index'])->name('projects.chat.index');
    Route::post('projects/{project}/chat', [ProjectChatController::class, 'store'])->name('projects.chat.store');

    // Advanced LaTeX Table Designer
    Route::get('projects/{project}/tables', [TableDesignController::class, 'index'])->name('projects.tables.index');
    Route::post('projects/{project}/tables', [TableDesignController::class, 'store'])->name('projects.tables.store');
    Route::post('projects/{project}/tables/insert', [TableDesignController::class, 'insertIntoFile'])->name('projects.tables.insert');
    Route::get('projects/{project}/tables/{tableDesign:public_id}', [TableDesignController::class, 'show'])->name('projects.tables.show');
    Route::put('projects/{project}/tables/{tableDesign:public_id}', [TableDesignController::class, 'update'])->name('projects.tables.update');
    Route::delete('projects/{project}/tables/{tableDesign:public_id}', [TableDesignController::class, 'destroy'])->name('projects.tables.destroy');

    // Advanced TikZ Figure Editor
    Route::get('projects/{project}/figures', [FigureController::class, 'index'])->name('projects.figures.index');
    Route::post('projects/{project}/figures', [FigureController::class, 'store'])->name('projects.figures.store');
    Route::get('projects/{project}/figures/{figure:public_id}', [FigureController::class, 'show'])->name('projects.figures.show');
    Route::put('projects/{project}/figures/{figure:public_id}', [FigureController::class, 'update'])->name('projects.figures.update');
    Route::delete('projects/{project}/figures/{figure:public_id}', [FigureController::class, 'destroy'])->name('projects.figures.destroy');

    // Phase 9: AI Research Assistant
    Route::get('projects/{project}/ai', [AiAssistantController::class, 'index'])->name('projects.ai.index');
    Route::post('projects/{project}/ai/ask', [AiAssistantController::class, 'ask'])->name('projects.ai.ask');
});

Route::middleware(['auth', 'verified', 'can:manage-public-site'])
    ->prefix('admin/public-site')
    ->name('admin.public-site.')
    ->group(function (): void {
        Route::get('/', [AdminPublicSiteController::class, 'index'])->name('index');
        Route::put('/settings', [AdminPublicSiteController::class, 'updateSettings'])->name('settings.update');
        Route::post('/plans', [AdminPublicSiteController::class, 'storePlan'])->name('plans.store');
        Route::put('/plans/{plan}', [AdminPublicSiteController::class, 'updatePlan'])->name('plans.update');
        Route::delete('/plans/{plan}', [AdminPublicSiteController::class, 'destroyPlan'])->name('plans.destroy');
        Route::get('/enquiries', [AdminContactEnquiryController::class, 'index'])->name('enquiries.index');
        Route::patch('/enquiries/{enquiry}', [AdminContactEnquiryController::class, 'update'])->name('enquiries.update');
        Route::get('/features', [AdminMarketingFeatureController::class, 'index'])->name('features.index');
        Route::post('/features', [AdminMarketingFeatureController::class, 'store'])->name('features.store');
        Route::put('/features/{feature}', [AdminMarketingFeatureController::class, 'update'])->name('features.update');
        Route::delete('/features/{feature}', [AdminMarketingFeatureController::class, 'destroy'])->name('features.destroy');
        Route::get('/templates', [AdminTemplateController::class, 'index'])->name('templates.index');
        Route::post('/templates', [AdminTemplateController::class, 'store'])->name('templates.store');
        Route::put('/templates/{template}', [AdminTemplateController::class, 'update'])->name('templates.update');
        Route::delete('/templates/{template}', [AdminTemplateController::class, 'destroy'])->name('templates.destroy');
    });

Route::middleware(['auth', 'verified', 'can:manage-public-site'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', AdminOverviewController::class)->name('dashboard');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/admin-role', [AdminUserController::class, 'updateAdminRole'])->name('users.admin-role.update');
        Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::patch('/projects/{project}/archive', [AdminProjectController::class, 'archive'])->name('projects.archive');
        Route::post('/projects/bulk-archive', [AdminProjectController::class, 'bulkArchive'])->name('projects.bulk-archive');
        Route::get('/organizations', [AdminOrganizationController::class, 'index'])->name('organizations.index');
        Route::patch('/organizations/{organization}/quota', [AdminOrganizationController::class, 'updateQuota'])->name('organizations.quota.update');
        Route::get('/audit', [AdminAuditController::class, 'index'])->name('audit.index');
        Route::get('/usage', [AdminUsageController::class, 'index'])->name('usage.index');
    });

require __DIR__.'/settings.php';

Route::fallback(function (Request $request) {
    if ($request->expectsJson() || $request->is('api/*')) {
        abort(404);
    }

    return Inertia::render('Public/NotFound')
        ->toResponse($request)
        ->setStatusCode(404);
});
