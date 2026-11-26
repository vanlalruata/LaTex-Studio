<?php

use App\Domain\Compilation\SyncTexService;

test('resolves forward synctex lookup from gzipped synctex data', function (): void {
    $synctex = implode("\n", [
        'SyncTeX Version:1',
        'Input:1:/work/src/main.tex',
        '{2',
        'h1,14:655360,1310720,100,100,0',
        '}2',
    ]);

    $gzipped = gzencode($synctex);
    expect($gzipped)->not->toBeFalse();

    $service = new SyncTexService;
    $location = $service->forwardLookup((string) $gzipped, 'main.tex', 14);

    expect($location)->not->toBeNull()
        ->and($location['page'])->toBe(2)
        ->and($location['x'])->toBe(10.0)
        ->and($location['y'])->toBe(20.0);
});
