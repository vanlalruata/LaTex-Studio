<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('research_assets', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('kind', 32);
            $table->string('title');
            $table->string('label', 120)->nullable();
            $table->text('caption')->nullable();
            $table->json('payload');
            $table->string('status', 24)->default('draft');
            $table->timestamps();

            $table->index(['project_id', 'kind']);
        });

        Schema::create('bibliography_sources', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('added_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('provider', 32)->default('manual');
            $table->string('key', 120);
            $table->string('title');
            $table->json('authors')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('venue')->nullable();
            $table->string('doi', 255)->nullable();
            $table->string('url', 512)->nullable();
            $table->text('raw_bibtex')->nullable();
            $table->boolean('is_imported')->default(false);
            $table->timestamps();

            $table->unique(['project_id', 'key']);
        });

        Schema::create('ocr_jobs', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 24)->default('queued')->index();
            $table->string('source_filename');
            $table->string('mime_type', 64)->nullable();
            $table->string('languages', 64)->default('eng');
            $table->longText('extracted_latex')->nullable();
            $table->decimal('confidence', 5, 2)->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });

        Schema::create('conversion_jobs', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 24)->default('queued')->index();
            $table->string('direction', 32);
            $table->string('engine', 32)->default('pandoc');
            $table->string('input_filename');
            $table->string('output_filename')->nullable();
            $table->text('log_excerpt')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversion_jobs');
        Schema::dropIfExists('ocr_jobs');
        Schema::dropIfExists('bibliography_sources');
        Schema::dropIfExists('research_assets');
    }
};
