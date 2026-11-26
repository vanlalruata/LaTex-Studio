<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_files', function (Blueprint $table): void {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('path', 512);
            $table->string('storage_key', 512)->nullable();
            $table->string('mime_type', 128)->default('text/plain');
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('sha256_checksum', 64)->nullable();
            $table->boolean('is_directory')->default(false);
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['project_id', 'path']);
            $table->index(['project_id', 'is_directory']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_files');
    }
};
