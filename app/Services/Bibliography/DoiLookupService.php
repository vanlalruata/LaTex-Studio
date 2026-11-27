<?php

namespace App\Services\Bibliography;

use Illuminate\Support\Facades\Http;
use Throwable;

class DoiLookupService implements BibliographyLookupInterface
{
    public function __construct(
        private readonly CrossRefLookupService $crossRef,
        private readonly BibTexParser $parser,
    ) {}

    public function lookup(string $identifier): ?array
    {
        $doi = $this->normalizeDoi($identifier);
        if ($doi === '') {
            return null;
        }

        $rawBibtex = null;

        try {
            $response = Http::timeout(8)
                ->withHeaders(['Accept' => 'application/x-bibtex'])
                ->get('https://doi.org/'.rawurlencode($doi));

            if ($response->successful() && str_contains($response->body(), '@')) {
                $rawBibtex = trim($response->body());
            }
        } catch (Throwable) {
            $rawBibtex = null;
        }

        if ($rawBibtex !== null) {
            $parsed = $this->parser->parse($rawBibtex);
            if ($parsed['entries'] !== []) {
                $first = $parsed['entries'][0];

                return [
                    'title' => $first['title'],
                    'authors' => $first['authors'],
                    'year' => $first['year'],
                    'venue' => $first['venue'],
                    'doi' => $first['doi'] ?? $doi,
                    'url' => $first['url'] ?? "https://doi.org/{$doi}",
                    'raw_bibtex' => $first['raw_bibtex'],
                ];
            }
        }

        $crossRefResult = $this->crossRef->lookup($doi);
        if ($crossRefResult !== null && $rawBibtex !== null) {
            $crossRefResult['raw_bibtex'] = $rawBibtex;
        }

        return $crossRefResult;
    }

    public function search(string $query, int $limit = 10): array
    {
        return $this->crossRef->search($query, $limit);
    }

    private function normalizeDoi(string $identifier): string
    {
        $trimmed = trim($identifier);
        $trimmed = (string) preg_replace('#^https?://(dx\.)?doi\.org/#i', '', $trimmed);

        return trim($trimmed);
    }
}
