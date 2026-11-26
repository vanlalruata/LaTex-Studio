<?php

namespace App\Http\Controllers\Settings;

use App\Enums\AiProvider;
use App\Http\Controllers\Controller;
use App\Models\UserAiCredential;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AiCredentialController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        abort_if($user === null, 401);

        $credentials = $user->aiCredentials()
            ->latest('created_at')
            ->get()
            ->map(fn (UserAiCredential $cred): array => [
                'public_id' => $cred->public_id,
                'provider' => $cred->provider->value,
                'provider_label' => $cred->provider->label(),
                'label' => $cred->label,
                'model' => $cred->model,
                'base_url' => $cred->base_url,
                'key_last_four' => $cred->key_last_four,
                'is_default' => $cred->is_default,
                'created_at' => $cred->created_at?->toIso8601String(),
            ]);

        return Inertia::render('settings/AiCredentials', [
            'credentials' => $credentials,
            'providers' => collect(AiProvider::cases())->map(fn (AiProvider $p): array => [
                'value' => $p->value,
                'label' => $p->label(),
                'default_model' => $p->defaultModel(),
            ])->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'provider' => ['required', Rule::enum(AiProvider::class)],
            'label' => ['required', 'string', 'max:120'],
            'model' => ['required', 'string', 'max:120'],
            'base_url' => ['nullable', 'url', 'max:512'],
            'api_key' => ['required', 'string', 'min:8', 'max:512'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $isDefault = $request->boolean('is_default', false)
            || $user->aiCredentials()->count() === 0;

        if ($isDefault) {
            $user->aiCredentials()->update(['is_default' => false]);
        }

        $rawKey = trim($validated['api_key']);
        $lastFour = strlen($rawKey) >= 4 ? substr($rawKey, -4) : $rawKey;

        UserAiCredential::query()->create([
            'user_id' => $user->id,
            'provider' => AiProvider::from($validated['provider']),
            'label' => $validated['label'],
            'model' => $validated['model'],
            'base_url' => $validated['base_url'] ?? null,
            'api_key' => $rawKey,
            'key_last_four' => $lastFour,
            'is_default' => $isDefault,
        ]);

        return back();
    }

    public function destroy(UserAiCredential $credential): RedirectResponse
    {
        Gate::authorize('delete', $credential);

        $credential->delete();

        return back();
    }
}
