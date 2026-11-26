<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('table_design_versions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('table_design_id')->constrained('table_designs')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->json('document_json');
            $table->longText('generated_latex');
            $table->string('checksum', 64);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['table_design_id', 'version_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('table_design_versions');
    }
};
