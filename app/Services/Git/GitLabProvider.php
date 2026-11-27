<?php

namespace App\Services\Git;

use Illuminate\Support\Facades\Http;

class GitLabProvider implements GitProviderInterface
{
    public function authorizationUrl(string $state, string $redirectUri): string
    {
        $query = http_build_query([
            'client_id' => config('git-integrations.gitlab.client_id'),
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'api',
            'state' => $state,
        ]);

        return $this->baseUrl().'/oauth/authorize?'.$query;
    }

    public function exchangeCode(string $code, string $redirectUri): ?string
    {
        $response = Http::timeout(10)
            ->acceptJson()
            ->post($this->baseUrl().'/oauth/token', [
                'client_id' => config('git-integrations.gitlab.client_id'),
                'client_secret' => config('git-integrations.gitlab.client_secret'),
                'code' => $code,
                'grant_type' => 'authorization_code',
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
            ->get($this->baseUrl().'/api/v4/projects', [
                'membership' => 'true',
                'per_page' => 50,
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
            if (! is_array($item) || ! is_string($item['path_with_namespace'] ?? null)) {
                continue;
            }
            $repos[] = [
                'full_name' => $item['path_with_namespace'],
                'default_branch' => is_string($item['default_branch'] ?? null) ? $item['default_branch'] : 'main',
                'private' => ($item['visibility'] ?? 'private') !== 'public',
            ];
        }

        return $repos;
    }

    public function getTree(string $token, string $repo, string $branch): array
    {
        $projectId = rawurlencode($repo);
        $response = Http::timeout(10)
            ->withToken($token)
            ->acceptJson()
            ->get($this->baseUrl()."/api/v4/projects/{$projectId}/repository/tree", [
                'ref' => $branch,
                'recursive' => 'true',
                'per_page' => 100,
            ]);

        if (! $response->successful()) {
            return [];
        }

        $items = $response->json();
        if (! is_array($items)) {
            return [];
        }

        $files = [];
        foreach ($items as $entry) {
            if (! is_array($entry) || ($entry['type'] ?? '') !== 'blob') {
                continue;
            }
            if (! is_string($entry['path'] ?? null)) {
                continue;
            }
            $files[] = [
                'path' => $entry['path'],
                'sha' => is_string($entry['id'] ?? null) ? $entry['id'] : null,
                'size' => 0,
            ];
        }

        return $files;
    }

    public function getFileContent(string $token, string $repo, string $path, string $ref): ?string
    {
        $projectId = rawurlencode($repo);
        $filePath = rawurlencode(ltrim($path, '/'));

        $response = Http::timeout(10)
            ->withToken($token)
            ->get($this->baseUrl()."/api/v4/projects/{$projectId}/repository/files/{$filePath}/raw", [
                'ref' => $ref,
            ]);

        return $response->successful() ? $response->body() : null;
    }

    public function commitFiles(
        string $token,
        string $repo,
        string $branch,
        string $message,
        array $files,
    ): ?string {
        $projectId = rawurlencode($repo);
        $existingTree = $this->getTree($token, $repo, $branch);
        $existingPaths = array_flip(array_map(static fn (array $item): string => $item['path'], $existingTree));

        $actions = [];
        foreach ($files as $path => $content) {
            $normalizedPath = ltrim($path, '/');
            $actions[] = [
                'action' => isset($existingPaths[$normalizedPath]) ? 'update' : 'create',
                'file_path' => $normalizedPath,
                'content' => $content,
            ];
        }

        $response = Http::timeout(10)
            ->withToken($token)
            ->acceptJson()
            ->post($this->baseUrl()."/api/v4/projects/{$projectId}/repository/commits", [
                'branch' => $branch,
                'commit_message' => $message,
                'actions' => $actions,
            ]);

        if (! $response->successful()) {
            return null;
        }

        $sha = $response->json('id');

        return is_string($sha) ? $sha : null;
    }

    private function baseUrl(): string
    {
        return rtrim((string) config('git-integrations.gitlab.base_url', 'https://gitlab.com'), '/');
    }
}
