<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('table_designs', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 120);
            $table->unsignedInteger('schema_version')->default(1);
            $table->json('document_json');
            $table->longText('generated_latex');
            $table->foreignId('source_file_id')->nullable()->constrained('project_files')->nullOnDelete();
            $table->foreignId('source_revision_id')->nullable()->constrained('project_revisions')->nullOnDelete();
            $table->string('status', 24)->default('visual');
            $table->timestamps();

            $table->index(['project_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('table_designs');
    }
};
