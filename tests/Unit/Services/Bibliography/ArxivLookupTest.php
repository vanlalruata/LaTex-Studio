<?php

use App\Services\Bibliography\ArxivLookupService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

uses(TestCase::class);

test('arxiv lookup parses atom feed metadata', function (): void {
    $xml = <<<'XML'
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:arxiv="http://arxiv.org/schemas/atom">
  <entry>
    <id>http://arxiv.org/abs/1706.03762v7</id>
    <published>2017-06-12T17:57:34Z</published>
    <title>Attention Is All You Need</title>
    <author><name>Ashish Vaswani</name></author>
    <author><name>Noam Shazeer</name></author>
    <arxiv:doi>10.48550/arXiv.1706.03762</arxiv:doi>
  </entry>
</feed>
XML;

    Http::fake([
        'export.arxiv.org/api/query*' => Http::response($xml, 200),
    ]);

    $result = app(ArxivLookupService::class)->lookup('https://arxiv.org/abs/1706.03762');

    expect($result)->not->toBeNull()
        ->and($result['title'])->toBe('Attention Is All You Need')
        ->and($result['authors'])->toBe(['Ashish Vaswani', 'Noam Shazeer'])
        ->and($result['year'])->toBe(2017)
        ->and($result['venue'])->toBe('arXiv')
        ->and($result['doi'])->toBe('10.48550/arXiv.1706.03762');
});
