<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('figures', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name', 120);
            $table->unsignedInteger('schema_version')->default(1);
            $table->string('mode', 24)->default('visual_native');
            $table->json('scene_json');
            $table->longText('tikz_source');
            $table->json('required_packages_json')->nullable();
            $table->json('required_libraries_json')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('figures');
    }
};
