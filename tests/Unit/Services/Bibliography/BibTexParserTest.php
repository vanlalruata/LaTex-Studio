<?php

use App\Services\Bibliography\BibTexParser;

test('parses valid bibtex entries and reports malformed entries without failing', function (): void {
    $bib = <<<'BIB'
@article{vaswani2017attention,
  title = {Attention Is All You Need},
  author = {Vaswani, Ashish and Shazeer, Noam},
  journal = {Advances in Neural Information Processing Systems},
  year = {2017},
  doi = {10.5555/3295222.3295349}
}

@misc{broken_no_title,
  author = {Anon}
}

@inproceedings{he2016deep,
  title = "Deep Residual Learning for Image Recognition",
  author = "He, Kaiming",
  booktitle = "CVPR",
  year = 2016
}
BIB;

    $parsed = (new BibTexParser)->parse($bib);

    expect($parsed['entries'])->toHaveCount(2)
        ->and($parsed['errors'])->toHaveCount(1)
        ->and($parsed['entries'][0]['key'])->toBe('vaswani2017attention')
        ->and($parsed['entries'][0]['authors'])->toBe(['Vaswani, Ashish', 'Shazeer, Noam'])
        ->and($parsed['entries'][0]['year'])->toBe(2017)
        ->and($parsed['entries'][1]['key'])->toBe('he2016deep')
        ->and($parsed['entries'][1]['venue'])->toBe('CVPR');
});
