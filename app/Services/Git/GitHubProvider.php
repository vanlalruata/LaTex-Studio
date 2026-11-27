<?php

namespace App\Services\Git;

use Illuminate\Support\Facades\Http;

class GitHubProvider implements GitProviderInterface
{
    public function authorizationUrl(string $state, string $redirectUri): string
    {
        $query = http_build_query([
            'client_id' => config('git-integrations.github.client_id'),
            'redirect_uri' => $redirectUri,
            'scope' => 'repo',
            'state' => $state,
        ]);

        return config('git-integrations.github.authorize_url').'?'.$query;
    }

    public function exchangeCode(string $code, string $redirectUri): ?string
    {
        $response = Http::timeout(10)
            ->acceptJson()
            ->post((string) config('git-integrations.github.token_url'), [
                'client_id' => config('git-integrations.github.client_id'),
                'client_secret' => config('git-integrations.github.client_secret'),
                'code' => $code,
                'redirect_uri' => $redirectUri,
            ]);

        if (! $response->successful()) {
            return null;
        }

        $token = $response->json('access_token');

        return is_string($token) && $token !== '' ? $token : null;
    }

    public function listRepositories(string $token): array
    {
        $response = Http::timeout(10)
            ->withToken($token)
            ->acceptJson()
            ->get($this->apiUrl().'/user/repos', [
                'per_page' => 50,
                'sort' => 'updated',
            ]);

        if (! $response->successful()) {
            return [];
        }

        $items = $response->json();
        if (! is_array($items)) {
            return [];
        }

        $repos = [];
        foreach ($items as $item) {
            if (! is_array($item) || ! is_string($item['full_name'] ?? null)) {
                continue;
            }
            $repos[] = [
                'full_name' => $item['full_name'],
                'default_branch' => is_string($item['default_branch'] ?? null) ? $item['default_branch'] : 'main',
                'private' => (bool) ($item['private'] ?? false),
            ];
        }

        return $repos;
    }

    public function getTree(string $token, string $repo, string $branch): array
    {
        $response = Http::timeout(10)
            ->withToken($token)
            ->acceptJson()
            ->get($this->apiUrl()."/repos/{$repo}/git/trees/".rawurlencode($branch), [
                'recursive' => 1,
            ]);

        if (! $response->successful()) {
            return [];
        }

        $tree = $response->json('tree', []);
        if (! is_array($tree)) {
            return [];
        }

        $files = [];
        foreach ($tree as $entry) {
            if (! is_array($entry) || ($entry['type'] ?? '') !== 'blob') {
                continue;
            }
            if (! is_string($entry['path'] ?? null)) {
                continue;
            }
            $files[] = [
                'path' => $entry['path'],
                'sha' => is_string($entry['sha'] ?? null) ? $entry['sha'] : null,
                'size' => (int) ($entry['size'] ?? 0),
            ];
        }

        return $files;
    }

    public function getFileContent(string $token, string $repo, string $path, string $ref): ?string
    {
        $response = Http::timeout(10)
            ->withToken($token)
            ->acceptJson()
            ->get($this->apiUrl()."/repos/{$repo}/contents/".ltrim($path, '/'), [
                'ref' => $ref,
            ]);

        if (! $response->successful()) {
            return null;
        }

        $encoded = $response->json('content');
        if (! is_string($encoded)) {
            return null;
        }

        $decoded = base64_decode(str_replace("\n", '', $encoded), true);

        return $decoded !== false ? $decoded : null;
    }

    public function commitFiles(
        string $token,
        string $repo,
        string $branch,
        string $message,
        array $files,
    ): ?string {
        $lastSha = null;

        foreach ($files as $path => $content) {
            $normalizedPath = ltrim($path, '/');
            $existing = Http::timeout(10)
                ->withToken($token)
                ->acceptJson()
                ->get($this->apiUrl()."/repos/{$repo}/contents/{$normalizedPath}", ['ref' => $branch]);

            $payload = [
                'message' => $message,
                'content' => base64_encode($content),
                'branch' => $branch,
            ];

            if ($existing->successful() && is_string($existing->json('sha'))) {
                $payload['sha'] = $existing->json('sha');
            }

            $put = Http::timeout(10)
                ->withToken($token)
                ->acceptJson()
                ->put($this->apiUrl()."/repos/{$repo}/contents/{$normalizedPath}", $payload);

            if (! $put->successful()) {
                return null;
            }

            $commitSha = $put->json('commit.sha');
            if (is_string($commitSha)) {
                $lastSha = $commitSha;
            }
        }

        return $lastSha;
    }

    private function apiUrl(): string
    {
        return rtrim((string) config('git-integrations.github.api_url', 'https://api.github.com'), '/');
    }
}
