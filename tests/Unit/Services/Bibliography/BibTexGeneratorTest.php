<?php

use App\Models\BibliographySource;
use App\Services\Bibliography\BibTexGenerator;

test('generates bibtex output preserving raw bibtex and formatting structured entries', function (): void {
    $raw = new BibliographySource([
        'key' => 'raw2024',
        'title' => 'Raw Entry',
        'raw_bibtex' => "@article{raw2024,\n  title={Raw Entry}\n}",
    ]);

    $structured = new BibliographySource([
        'key' => 'smith2025paper',
        'title' => 'Structured Paper',
        'authors' => ['Alice Smith', 'Bob Jones'],
        'year' => 2025,
        'venue' => 'Journal of Testing',
        'doi' => '10.1000/test',
    ]);

    $output = (new BibTexGenerator)->generate(collect([$raw, $structured]));

    expect($output)->toContain('@article{raw2024,')
        ->and($output)->toContain('@misc{smith2025paper,')
        ->and($output)->toContain('author = {Alice Smith and Bob Jones}')
        ->and($output)->toContain('year = {2025}')
        ->and($output)->toContain('doi = {10.1000/test}');
});
