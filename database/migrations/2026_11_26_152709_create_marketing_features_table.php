<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('marketing_features')) {
            return;
        }

        Schema::create('marketing_features', function (Blueprint $table): void {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('summary', 500);
            $table->text('description');
            $table->string('category', 100)->index();
            $table->string('availability_status', 24)->default('planned')->index();
            $table->string('icon_key', 32)->default('code');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_public')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_public', 'availability_status', 'sort_order'], 'marketing_features_public_status_sort_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketing_features');
    }
};
