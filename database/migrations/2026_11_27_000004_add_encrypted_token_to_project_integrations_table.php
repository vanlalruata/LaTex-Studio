<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_integrations', function (Blueprint $table): void {
            $table->text('encrypted_token')->nullable()->after('config');
            $table->text('webhook_secret')->nullable()->after('encrypted_token');
        });
    }

    public function down(): void
    {
        Schema::table('project_integrations', function (Blueprint $table): void {
            $table->dropColumn(['encrypted_token', 'webhook_secret']);
        });
    }
};
