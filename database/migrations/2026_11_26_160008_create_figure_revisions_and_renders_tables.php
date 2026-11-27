<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('figure_revisions', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('figure_id')->constrained('figures')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('schema_version')->default(1);
            $table->string('mode', 24)->default('visual_native');
            $table->json('scene_json');
            $table->longText('tikz_source');
            $table->string('summary', 200)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['figure_id', 'created_at']);
        });

        Schema::create('figure_render_jobs', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('figure_id')->constrained('figures')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('engine', 24)->default('pdflatex');
            $table->string('status', 24)->default('queued');
            $table->integer('exit_code')->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->text('error_summary')->nullable();
            $table->json('diagnostics_json')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();

            $table->index(['figure_id', 'created_at']);
        });

        Schema::create('figure_artifacts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('figure_render_job_id')->constrained('figure_render_jobs')->cascadeOnDelete();
            $table->string('type', 16);
            $table->string('storage_key', 255);
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('sha256_checksum', 64)->nullable();
            $table->timestamps();

            $table->index(['figure_render_job_id', 'type']);
        });

        Schema::table('figures', function (Blueprint $table): void {
            $table->foreignId('last_successful_render_job_id')
                ->nullable()
                ->after('required_libraries_json')
                ->constrained('figure_render_jobs')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('figures', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('last_successful_render_job_id');
        });
        Schema::dropIfExists('figure_artifacts');
        Schema::dropIfExists('figure_render_jobs');
        Schema::dropIfExists('figure_revisions');
    }
};
