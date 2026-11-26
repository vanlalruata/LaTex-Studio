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

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@latexstudio.com'],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole($adminRole);

        User::query()->firstOrCreate(
            ['email' => 'researcher@latexstudio.com'],
            [
                'name' => 'Dr. Researcher',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::query()->firstOrCreate(
            ['email' => 'coauthor@latexstudio.com'],
            [
                'name' => 'Co-Author',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::query()->firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            TemplateSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
