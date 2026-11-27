<?php

use App\Services\Bibliography\CrossRefLookupService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

uses(TestCase::class);

test('crossref lookup resolves doi metadata', function (): void {
    Http::fake([
        'api.crossref.org/works/*' => Http::response([
            'message' => [
                'title' => ['Attention Is All You Need'],
                'author' => [
                    ['given' => 'Ashish', 'family' => 'Vaswani'],
                    ['given' => 'Noam', 'family' => 'Shazeer'],
                ],
                'published' => ['date-parts' => [[2017]]],
                'container-title' => ['NeurIPS'],
                'DOI' => '10.5555/3295222.3295349',
                'URL' => 'https://doi.org/10.5555/3295222.3295349',
            ],
        ], 200),
    ]);

    $result = app(CrossRefLookupService::class)->lookup('https://doi.org/10.5555/3295222.3295349');

    expect($result)->not->toBeNull()
        ->and($result['title'])->toBe('Attention Is All You Need')
        ->and($result['authors'])->toBe(['Ashish Vaswani', 'Noam Shazeer'])
        ->and($result['year'])->toBe(2017)
        ->and($result['venue'])->toBe('NeurIPS');
});

test('crossref search returns mapped list', function (): void {
    Http::fake([
        'api.crossref.org/works*' => Http::response([
            'message' => [
                'items' => [
                    [
                        'title' => ['Deep Residual Learning'],
                        'author' => [['given' => 'Kaiming', 'family' => 'He']],
                        'published-print' => ['date-parts' => [[2016]]],
                        'container-title' => ['CVPR'],
                        'DOI' => '10.1109/CVPR.2016.90',
                    ],
                ],
            ],
        ], 200),
    ]);

    $results = app(CrossRefLookupService::class)->search('resnet');

    expect($results)->toHaveCount(1)
        ->and($results[0]['title'])->toBe('Deep Residual Learning')
        ->and($results[0]['year'])->toBe(2016);
});
