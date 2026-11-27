<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equations', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 160);
            $table->unsignedInteger('schema_version')->default(1);
            $table->string('content_mode', 24)->default('structured');
            $table->string('math_mode', 24)->default('display');
            $table->string('environment', 32)->default('equation');
            $table->json('structured_document_json')->nullable();
            $table->longText('latex_source');
            $table->json('package_requirements_json')->nullable();
            $table->string('source_hash', 64);
            $table->string('last_successful_pdf_key', 255)->nullable();
            $table->timestamps();

            $table->index(['project_id', 'updated_at']);
            $table->index(['user_id', 'updated_at']);
        });

        Schema::create('equation_revisions', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('equation_id')->constrained('equations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('content_mode', 24)->default('structured');
            $table->json('structured_document_json')->nullable();
            $table->longText('latex_source');
            $table->string('summary', 200)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['equation_id', 'created_at']);
        });

        Schema::create('equation_comments', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('equation_id')->constrained('equations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['equation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equation_comments');
        Schema::dropIfExists('equation_revisions');
        Schema::dropIfExists('equations');
    }
};
