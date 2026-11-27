<?php

namespace App\Providers;

use App\Models\User;
use App\Services\Compiler\CompilerAdapterFactory;
use App\Services\Compiler\LatexCompilerInterface;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(LatexCompilerInterface::class, function ($app): LatexCompilerInterface {
            return $app->make(CompilerAdapterFactory::class)->resolve();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::define('manage-public-site', static fn (User $user): bool => $user->hasRole('admin'));

        RateLimiter::for('contact-enquiry', static fn (Request $request): Limit => Limit::perMinute(5)->by((string) $request->ip()));
        RateLimiter::for('bibliography-lookup', static function (Request $request): Limit {
            $user = $request->user();

            return Limit::perMinute(30)->by($user !== null ? (string) $user->id : (string) $request->ip());
        });
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
