<?php

namespace App\Services\Bibliography;

class BibTexParser
{
    /**
     * Parse raw BibTeX content into structured entries plus any parse warnings.
     *
     * @return array{
     *     entries: list<array{
     *         entry_type: string,
     *         key: string,
     *         title: string,
     *         authors: list<string>,
     *         year: int|null,
     *         venue: string|null,
     *         doi: string|null,
     *         url: string|null,
     *         raw_bibtex: string
     *     }>,
     *     errors: list<string>
     * }
     */
    public function parse(string $content): array
    {
        $entries = [];
        $errors = [];

        $length = strlen($content);
        $offset = 0;

        while ($offset < $length) {
            $atPos = strpos($content, '@', $offset);
            if ($atPos === false) {
                break;
            }

            $rest = substr($content, $atPos);
            if (preg_match('/^@([A-Za-z]+)\s*([\{\(])/', $rest, $headerMatch, PREG_OFFSET_CAPTURE) !== 1) {
                $offset = $atPos + 1;

                continue;
            }

            $entryType = strtolower($headerMatch[1][0]);
            $openChar = $headerMatch[2][0];
            $closeChar = $openChar === '{' ? '}' : ')';
            $bodyStart = $atPos + $headerMatch[2][1] + 1;

            if (in_array($entryType, ['comment', 'preamble', 'string'], true)) {
                $endPos = $this->findMatchingDelimiter($content, $bodyStart, $openChar, $closeChar);
                $offset = $endPos !== null ? $endPos + 1 : $length;

                continue;
            }

            $endPos = $this->findMatchingDelimiter($content, $bodyStart, $openChar, $closeChar);
            if ($endPos === null) {
                $errors[] = "Unclosed @{$entryType} entry near offset {$atPos}.";
                break;
            }

            $rawEntry = substr($content, $atPos, ($endPos - $atPos) + 1);
            $innerBody = substr($content, $bodyStart, $endPos - $bodyStart);
            $offset = $endPos + 1;

            $commaPos = strpos($innerBody, ',');
            if ($commaPos === false) {
                $errors[] = "Malformed @{$entryType} entry: missing citation key separator.";

                continue;
            }

            $key = trim(substr($innerBody, 0, $commaPos));
            if ($key === '' || preg_match('/^[A-Za-z0-9_:.-]+$/', $key) !== 1) {
                $errors[] = "Invalid citation key [{$key}] in @{$entryType} entry.";

                continue;
            }

            $fields = $this->parseFields(substr($innerBody, $commaPos + 1));
            $title = $this->cleanText($fields['title'] ?? '');

            if ($title === '') {
                $errors[] = "Entry [{$key}] is missing a title.";

                continue;
            }

            $authors = $this->splitAuthors($fields['author'] ?? '');
            $yearRaw = $fields['year'] ?? '';
            $year = preg_match('/(\d{4})/', $yearRaw, $ym) === 1 ? (int) $ym[1] : null;

            $venue = $this->cleanText(
                $fields['journal']
                ?? $fields['booktitle']
                ?? $fields['publisher']
                ?? $fields['school']
                ?? $fields['institution']
                ?? ''
            );

            $doi = $this->cleanText($fields['doi'] ?? '');
            $url = $this->cleanText($fields['url'] ?? '');

            $entries[] = [
                'entry_type' => $entryType,
                'key' => $key,
                'title' => $title,
                'authors' => $authors,
                'year' => $year,
                'venue' => $venue !== '' ? $venue : null,
                'doi' => $doi !== '' ? $doi : null,
                'url' => $url !== '' ? $url : null,
                'raw_bibtex' => $rawEntry,
            ];
        }

        return [
            'entries' => $entries,
            'errors' => $errors,
        ];
    }

    private function findMatchingDelimiter(string $content, int $start, string $openChar, string $closeChar): ?int
    {
        $depth = 1;
        $length = strlen($content);

        for ($i = $start; $i < $length; $i++) {
            $char = $content[$i];

            if ($char === '\\') {
                $i++;

                continue;
            }

            if ($char === $openChar) {
                $depth++;
            } elseif ($char === $closeChar) {
                $depth--;
                if ($depth === 0) {
                    return $i;
                }
            }
        }

        return null;
    }

    /**
     * @return array<string, string>
     */
    private function parseFields(string $body): array
    {
        $fields = [];
        $length = strlen($body);
        $pos = 0;

        while ($pos < $length) {
            while ($pos < $length && (ctype_space($body[$pos]) || $body[$pos] === ',')) {
                $pos++;
            }

            if ($pos >= $length) {
                break;
            }

            if (preg_match('/^([A-Za-z][A-Za-z0-9_-]*)\s*=\s*/', substr($body, $pos), $match) !== 1) {
                break;
            }

            $fieldName = strtolower($match[1]);
            $pos += strlen($match[0]);

            if ($pos >= $length) {
                break;
            }

            $value = '';
            $delim = $body[$pos];

            if ($delim === '{') {
                $end = $this->findMatchingDelimiter($body, $pos + 1, '{', '}');
                if ($end === null) {
                    break;
                }
                $value = substr($body, $pos + 1, $end - ($pos + 1));
                $pos = $end + 1;
            } elseif ($delim === '"') {
                $end = $this->findClosingQuote($body, $pos + 1);
                if ($end === null) {
                    break;
                }
                $value = substr($body, $pos + 1, $end - ($pos + 1));
                $pos = $end + 1;
            } else {
                $commaPos = strpos($body, ',', $pos);
                if ($commaPos === false) {
                    $value = trim(substr($body, $pos));
                    $pos = $length;
                } else {
                    $value = trim(substr($body, $pos, $commaPos - $pos));
                    $pos = $commaPos + 1;
                }
            }

            $fields[$fieldName] = $value;
        }

        return $fields;
    }

    private function findClosingQuote(string $body, int $start): ?int
    {
        $depth = 0;
        $length = strlen($body);

        for ($i = $start; $i < $length; $i++) {
            $char = $body[$i];
            if ($char === '\\') {
                $i++;

                continue;
            }
            if ($char === '{') {
                $depth++;
            } elseif ($char === '}') {
                $depth = max(0, $depth - 1);
            } elseif ($char === '"' && $depth === 0) {
                return $i;
            }
        }

        return null;
    }

    /**
     * @return list<string>
     */
    private function splitAuthors(string $rawAuthors): array
    {
        $cleaned = $this->cleanText($rawAuthors);
        if ($cleaned === '') {
            return [];
        }

        $parts = preg_split('/\s+and\s+/i', $cleaned) ?: [];
        $authors = [];

        foreach ($parts as $part) {
            $name = trim($part);
            if ($name !== '') {
                $authors[] = $name;
            }
        }

        return $authors;
    }

    private function cleanText(string $value): string
    {
        $trimmed = trim($value);
        $trimmed = str_replace(['{', '}'], '', $trimmed);

        return trim((string) preg_replace('/\s+/', ' ', $trimmed));
    }
}
