<?php

namespace App\Services\Bibliography;

interface BibliographyLookupInterface
{
    /**
     * Lookup a single reference by identifier (DOI, arXiv ID, etc.).
     *
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
    public function lookup(string $identifier): ?array;

    /**
     * Search references by free-text query.
     *
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
    public function search(string $query, int $limit = 10): array;
}
