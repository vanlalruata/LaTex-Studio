<?php

use App\Domain\Files\PathValidator;

test('normalizes valid relative paths', function (): void {
    $validator = new PathValidator;

    expect($validator->normalize('main.tex'))->toBe('main.tex')
        ->and($validator->normalize('/chapters//01-intro.tex'))->toBe('chapters/01-intro.tex')
        ->and($validator->normalize('figures\plot.png'))->toBe('figures/plot.png');
});

test('rejects path traversal and unsafe paths', function (string $badPath): void {
    $validator = new PathValidator;

    expect(fn () => $validator->normalize($badPath))
        ->toThrow(InvalidArgumentException::class);
})->with([
    'parent traversal' => ['../etc/passwd'],
    'nested traversal' => ['chapters/../../secret.txt'],
    'null byte' => ["main.tex\0.pdf"],
    'drive letter' => ['C:/Windows/System32/drivers/etc/hosts'],
    'empty' => ['   '],
    'dot only' => ['.'],
]);

test('infers common academic file mime types', function (): void {
    $validator = new PathValidator;

    expect($validator->inferMimeType('main.tex'))->toBe('text/x-tex')
        ->and($validator->inferMimeType('refs.bib'))->toBe('application/x-bibtex')
        ->and($validator->inferMimeType('fig.png'))->toBe('image/png');
});
