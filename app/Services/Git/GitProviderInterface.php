<?php

namespace App\Services\Git;

interface GitProviderInterface
{
    public function authorizationUrl(string $state, string $redirectUri): string;

    public function exchangeCode(string $code, string $redirectUri): ?string;

    /**
     * @return list<array{full_name: string, default_branch: string, private: bool}>
     */
    public function listRepositories(string $token): array;

    /**
     * @return list<array{path: string, sha: string|null, size: int}>
     */
    public function getTree(string $token, string $repo, string $branch): array;

    public function getFileContent(string $token, string $repo, string $path, string $ref): ?string;

    /**
     * @param  array<string, string>  $files  Map of relative path => file contents
     */
    public function commitFiles(
        string $token,
        string $repo,
        string $branch,
        string $message,
        array $files,
    ): ?string;
}
