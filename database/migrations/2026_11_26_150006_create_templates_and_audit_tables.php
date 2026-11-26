<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('organization_id')->nullable()->constrained('organizations')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('category', 64)->default('article');
            $table->text('description')->nullable();
            $table->string('compiler_engine', 32)->default('pdflatex');
            $table->json('files_manifest');
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });

        Schema::create('audit_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->string('action', 128)->index();
            $table->string('subject_type', 128)->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['project_id', 'created_at']);
        });

        Schema::create('usage_records', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->string('metric', 64);
            $table->unsignedBigInteger('quantity');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'metric', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_records');
        Schema::dropIfExists('audit_events');
        Schema::dropIfExists('templates');
    }
};
