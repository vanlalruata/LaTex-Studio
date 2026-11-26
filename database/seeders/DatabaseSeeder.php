<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::query()->firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $admin = $this->ensureUser('admin@latexstudio.com', 'Platform Admin');
        $admin->assignRole($adminRole);

        $this->ensureUser('researcher@latexstudio.com', 'Dr. Researcher');
        $this->ensureUser('coauthor@latexstudio.com', 'Co-Author');
        $this->ensureUser('reviewer@latexstudio.com', 'Dr. Priya Nair');
        $this->ensureUser('commenter@latexstudio.com', 'Sam Okafor');
        $this->ensureUser('viewer@latexstudio.com', 'Guest Reader');
        $this->ensureUser('test@example.com', 'Test User');

        $this->call([
            MarketingFeatureSeeder::class,
            TemplateSeeder::class,
            ProjectSeeder::class,
            PublicSiteSeeder::class,
            CollaborationSeeder::class,
            ResearchToolsSeeder::class,
            ProjectManagementSeeder::class,
            AiSeeder::class,
            ActivitySeeder::class,
            TableStyleProfileSeeder::class,
        ]);
    }

    private function ensureUser(string $email, string $name): User
    {
        return User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
