<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_revisions', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('revision_hash', 64);
            $table->json('manifest');
            $table->string('message')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'created_at']);
            $table->unique(['project_id', 'revision_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_revisions');
    }
};
