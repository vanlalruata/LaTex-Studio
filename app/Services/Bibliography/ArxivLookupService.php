<?php

namespace App\Services\Bibliography;

use Illuminate\Support\Facades\Http;
use SimpleXMLElement;
use Throwable;

class ArxivLookupService implements BibliographyLookupInterface
{
    public function lookup(string $identifier): ?array
    {
        $arxivId = $this->normalizeId($identifier);
        if ($arxivId === '') {
            return null;
        }

        try {
            $response = Http::timeout(8)->get('https://export.arxiv.org/api/query', [
                'id_list' => $arxivId,
            ]);

            if (! $response->successful()) {
                return null;
            }

            $entries = $this->parseFeed($response->body());

            return $entries[0] ?? null;
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
            $response = Http::timeout(8)->get('https://export.arxiv.org/api/query', [
                'search_query' => 'all:'.$trimmed,
                'start' => 0,
                'max_results' => min(20, max(1, $limit)),
            ]);

            if (! $response->successful()) {
                return [];
            }

            return $this->parseFeed($response->body());
        } catch (Throwable) {
            return [];
        }
    }

    /**
     * @return list<array{
     *     title: string,
     *     authors: list<string>,
     *     year: int|null,
     *     venue: string|null,
     *     doi: string|null,
     *     url: string|null,
     *     raw_bibtex: string|null
     * }>
     */
    private function parseFeed(string $xmlBody): array
    {
        $previous = libxml_use_internal_errors(true);
        $xml = simplexml_load_string($xmlBody);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $xml instanceof SimpleXMLElement) {
            return [];
        }

        $results = [];

        foreach ($xml->entry as $entry) {
            $title = trim((string) preg_replace('/\s+/', ' ', (string) $entry->title));
            if ($title === '') {
                continue;
            }

            $authors = [];
            foreach ($entry->author as $author) {
                $name = trim((string) $author->name);
                if ($name !== '') {
                    $authors[] = $name;
                }
            }

            $published = trim((string) $entry->published);
            $year = preg_match('/^(\d{4})/', $published, $m) === 1 ? (int) $m[1] : null;
            $url = trim((string) $entry->id) ?: null;

            $arxivNs = $entry->children('http://arxiv.org/schemas/atom');
            $doi = trim((string) ($arxivNs->doi ?? '')) ?: null;

            $results[] = [
                'title' => $title,
                'authors' => $authors,
                'year' => $year,
                'venue' => 'arXiv',
                'doi' => $doi,
                'url' => $url,
                'raw_bibtex' => null,
            ];
        }

        return $results;
    }

    private function normalizeId(string $identifier): string
    {
        $trimmed = trim($identifier);
        $trimmed = (string) preg_replace('#^https?://arxiv\.org/(abs|pdf)/#i', '', $trimmed);
        $trimmed = (string) preg_replace('/^arxiv:/i', '', $trimmed);

        return trim($trimmed, '/ ');
    }
}
