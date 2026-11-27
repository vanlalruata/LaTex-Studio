<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutional_domains', function (Blueprint $table): void {
            $table->id();
            $table->string('domain', 255)->unique();
            $table->string('institution_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('max_users')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['is_active', 'expires_at']);
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->boolean('is_institutional_free')->default(false)->after('remember_token');
            $table->string('institutional_domain', 255)->nullable()->after('is_institutional_free')->index();
            $table->timestamp('institutional_granted_at')->nullable()->after('institutional_domain');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropIndex(['institutional_domain']);
            $table->dropColumn([
                'is_institutional_free',
                'institutional_domain',
                'institutional_granted_at',
            ]);
        });

        Schema::dropIfExists('institutional_domains');
    }
};
