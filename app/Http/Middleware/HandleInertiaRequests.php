<?php

namespace App\Http\Middleware;

use App\Models\InstitutionalDomain;
use App\Services\PublicSite\PublicSiteSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userData = null;

        if ($user !== null) {
            $institutionName = null;
            if ($user->is_institutional_free && $user->institutional_domain !== null && Schema::hasTable('institutional_domains')) {
                $institutionName = InstitutionalDomain::query()
                    ->where('domain', $user->institutional_domain)
                    ->value('institution_name');
            }

            $userData = [
                ...$user->toArray(),
                'institution_name' => is_string($institutionName) ? $institutionName : null,
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $userData,
                'canManageAdmin' => $user?->can('manage-public-site') ?? false,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'canonicalUrl' => $request->url(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'publicSite' => fn () => app(PublicSiteSettings::class)->toSharedProps(),
        ];
    }
}
