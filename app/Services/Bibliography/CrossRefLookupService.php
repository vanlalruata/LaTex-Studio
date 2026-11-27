<?php

namespace App\Services\Bibliography;

use Illuminate\Support\Facades\Http;
use Throwable;

class CrossRefLookupService implements BibliographyLookupInterface
{
    public function lookup(string $identifier): ?array
    {
        $doi = $this->normalizeDoi($identifier);
        if ($doi === '') {
            return null;
        }

        try {
            $response = Http::timeout(8)
                ->acceptJson()
                ->get('https://api.crossref.org/works/'.rawurlencode($doi));

            if (! $response->successful()) {
                return null;
            }

            /** @var array<string, mixed>|null $message */
            $message = $response->json('message');

            return is_array($message) ? $this->mapItem($message) : null;
        } catch (Throwable) {
            return null;
        }
    }

    public function search(string $query, int $limit = 10): array
    {
        $trimmed = trim($query);
        if ($trimmed === '') {
            return [];
        }

        try {
            $response = Http::timeout(8)
                ->acceptJson()
                ->get('https://api.crossref.org/works', [
                    'query' => $trimmed,
                    'rows' => min(20, max(1, $limit)),
                ]);

            if (! $response->successful()) {
                return [];
            }

            /** @var list<array<string, mixed>> $items */
            $items = $response->json('message.items', []);
            $results = [];

            foreach ($items as $item) {
                $mapped = $this->mapItem($item);
                if ($mapped !== null) {
                    $results[] = $mapped;
                }
            }

            return $results;
        } catch (Throwable) {
            return [];
        }
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array{
     *     title: string,
     *     authors: list<string>,
     *     year: int|null,
     *     venue: string|null,
     *     doi: string|null,
     *     url: string|null,
     *     raw_bibtex: string|null
     * }|null
     */
    private function mapItem(array $item): ?array
    {
        $titles = $item['title'] ?? [];
        $title = is_array($titles) && isset($titles[0]) && is_string($titles[0]) ? trim($titles[0]) : '';
        if ($title === '') {
            return null;
        }

        $authors = [];
        if (is_array($item['author'] ?? null)) {
            foreach ($item['author'] as $author) {
                if (! is_array($author)) {
                    continue;
                }
                $family = is_string($author['family'] ?? null) ? trim($author['family']) : '';
                $given = is_string($author['given'] ?? null) ? trim($author['given']) : '';
                $full = trim("{$given} {$family}");
                if ($full !== '') {
                    $authors[] = $full;
                }
            }
        }

        $year = null;
        $dateParts = $item['published']['date-parts'][0]
            ?? $item['published-print']['date-parts'][0]
            ?? $item['published-online']['date-parts'][0]
            ?? null;
        if (is_array($dateParts) && isset($dateParts[0]) && is_numeric($dateParts[0])) {
            $year = (int) $dateParts[0];
        }

        $venues = $item['container-title'] ?? [];
        $venue = is_array($venues) && isset($venues[0]) && is_string($venues[0]) ? trim($venues[0]) : null;
        $doi = is_string($item['DOI'] ?? null) ? trim($item['DOI']) : null;
        $url = is_string($item['URL'] ?? null) ? trim($item['URL']) : ($doi !== null ? "https://doi.org/{$doi}" : null);

        return [
            'title' => $title,
            'authors' => $authors,
            'year' => $year,
            'venue' => $venue,
            'doi' => $doi,
            'url' => $url,
            'raw_bibtex' => null,
        ];
    }

    private function normalizeDoi(string $identifier): string
    {
        $trimmed = trim($identifier);
        $trimmed = (string) preg_replace('#^https?://(dx\.)?doi\.org/#i', '', $trimmed);

        return trim($trimmed);
    }
}
