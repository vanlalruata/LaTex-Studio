<?php

use App\Http\Controllers\CompilationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
use App\Http\Controllers\ProjectIndexController;
use App\Http\Controllers\ProjectRevisionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

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
});

require __DIR__.'/settings.php';
