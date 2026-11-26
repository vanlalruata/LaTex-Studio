<?php

use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompilationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ProjectIndexController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\ProjectRevisionController;
use App\Http\Controllers\PublicSite\AboutController;
use App\Http\Controllers\PublicSite\FaqController;
use App\Http\Controllers\PublicSite\FeatureController;
use App\Http\Controllers\PublicSite\HomeController;
use App\Http\Controllers\PublicSite\HowItWorksController;
use App\Http\Controllers\PublicSite\LegalController;
use App\Http\Controllers\PublicSite\TemplateController;
use App\Http\Controllers\SuggestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::get('/features', FeatureController::class)->name('public.features');
Route::get('/how-it-works', HowItWorksController::class)->name('public.how-it-works');
Route::get('/templates', TemplateController::class)->name('public.templates');
Route::get('/about', AboutController::class)->name('public.about');
Route::get('/faq', FaqController::class)->name('public.faq');
Route::get('/privacy', [LegalController::class, 'privacy'])->name('public.privacy');
Route::get('/terms', [LegalController::class, 'terms'])->name('public.terms');

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
    Route::get('projects/{project}/index', ProjectIndexController::class)->name('projects.index');

    Route::post('projects/{project}/compilations', [CompilationController::class, 'store'])->name('projects.compilations.store');
    Route::get('compilations/{compilation}', [CompilationController::class, 'show'])->name('compilations.show');
    Route::get('compilations/{compilation}/artifacts/{type}', [CompilationController::class, 'artifact'])->name('compilations.artifacts.show');

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

    // Phase 9: AI Research Assistant
    Route::get('projects/{project}/ai', [AiAssistantController::class, 'index'])->name('projects.ai.index');
    Route::post('projects/{project}/ai/ask', [AiAssistantController::class, 'ask'])->name('projects.ai.ask');
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
