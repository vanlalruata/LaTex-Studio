<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compilations', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('revision_id')->nullable()->constrained('project_revisions')->nullOnDelete();
            $table->foreignId('triggered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('idempotency_key', 128)->unique();
            $table->string('compiler_engine', 32);
            $table->string('build_profile', 32)->default('standard');
            $table->string('worker_image_digest', 128)->nullable();
            $table->string('status', 32)->default('requested')->index();
            $table->integer('exit_code')->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->unsignedInteger('peak_memory_kb')->nullable();
            $table->text('error_summary')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'created_at']);
        });

        Schema::create('build_artifacts', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('compilation_id')->constrained('compilations')->cascadeOnDelete();
            $table->string('type', 32);
            $table->string('storage_key', 512);
            $table->string('sha256_checksum', 64);
            $table->unsignedBigInteger('size_bytes');
            $table->timestamps();

            $table->unique(['compilation_id', 'type']);
        });

        Schema::create('diagnostics', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('compilation_id')->constrained('compilations')->cascadeOnDelete();
            $table->string('severity', 16);
            $table->string('file_path', 512)->nullable();
            $table->unsignedInteger('line')->nullable();
            $table->unsignedInteger('column')->nullable();
            $table->string('code', 64)->nullable();
            $table->text('message');
            $table->text('raw_excerpt')->nullable();
            $table->timestamps();

            $table->index(['compilation_id', 'severity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diagnostics');
        Schema::dropIfExists('build_artifacts');
        Schema::dropIfExists('compilations');
    }
};
