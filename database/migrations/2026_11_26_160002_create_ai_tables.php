<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_ai_credentials', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider', 32);
            $table->string('label', 120);
            $table->string('model', 120);
            $table->string('base_url', 512)->nullable();
            $table->text('api_key');
            $table->string('key_last_four', 8);
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'provider']);
        });

        Schema::create('ai_conversations', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('provider', 32);
            $table->string('model', 120);
            $table->timestamps();
        });

        Schema::create('ai_actions', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('conversation_id')->constrained('ai_conversations')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_file_id')->nullable()->constrained('project_files')->nullOnDelete();
            $table->string('kind', 32)->default('chat');
            $table->text('prompt');
            $table->longText('response_text');
            $table->json('proposed_patch')->nullable();
            $table->string('status', 24)->default('info');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_actions');
        Schema::dropIfExists('ai_conversations');
        Schema::dropIfExists('user_ai_credentials');
    }
};
