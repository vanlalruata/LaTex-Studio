<?php

namespace App\Services\Bibliography;

use App\Models\BibliographySource;
use Illuminate\Support\Collection;

class BibTexGenerator
{
    /**
     * @param  Collection<int, BibliographySource>  $sources
     */
    public function generate(Collection $sources): string
    {
        if ($sources->isEmpty()) {
            return "% No bibliography sources configured.\n";
        }

        $blocks = [];

        foreach ($sources as $source) {
            if (is_string($source->raw_bibtex) && trim($source->raw_bibtex) !== '') {
                $blocks[] = trim($source->raw_bibtex);

                continue;
            }

            $blocks[] = $this->formatSource($source);
        }

        return implode("\n\n", $blocks)."\n";
    }

    public function formatSource(BibliographySource $source): string
    {
        $fields = [
            'title' => $source->title,
        ];

        $authors = $source->authors ?? [];
        if ($authors !== []) {
            $fields['author'] = implode(' and ', $authors);
        }

        if ($source->year !== null) {
            $fields['year'] = (string) $source->year;
        }

        if ($source->venue !== null && $source->venue !== '') {
            $fields['journal'] = $source->venue;
        }

        if ($source->doi !== null && $source->doi !== '') {
            $fields['doi'] = $source->doi;
        }

        if ($source->url !== null && $source->url !== '') {
            $fields['url'] = $source->url;
        }

        $lines = ["@misc{{$source->key},"];
        $total = count($fields);
        $index = 0;

        foreach ($fields as $fieldKey => $fieldValue) {
            $comma = $index < $total - 1 ? ',' : '';
            $lines[] = "  {$fieldKey} = {{$fieldValue}}{$comma}";
            $index++;
        }

        $lines[] = '}';

        return implode("\n", $lines);
    }
}
