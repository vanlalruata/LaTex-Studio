<?php

namespace App\Domain\Figures;

use App\Models\Figure;

class StandaloneTikzBuilder
{
    /** @var list<string> */
    private const ALLOWED_PACKAGES = [
        'tikz',
        'amsmath',
        'amssymb',
        'amsthm',
        'xcolor',
        'pgfplots',
        'graphicx',
    ];

    /** @var list<string> */
    private const ALLOWED_LIBRARIES = [
        'arrows.meta',
        'shapes.geometric',
        'positioning',
        'fit',
        'backgrounds',
        'matrix',
        'chains',
        'calc',
        'decorations.pathmorphing',
        'decorations.pathreplacing',
        'patterns',
        'angles',
        'quotes',
    ];

    public function build(Figure $figure): string
    {
        $packages = collect($figure->required_packages_json ?? ['tikz'])
            ->filter(fn (string $p): bool => in_array($p, self::ALLOWED_PACKAGES, true))
            ->reject(fn (string $p): bool => $p === 'tikz')
            ->unique()
            ->values();

        $libraries = collect($figure->required_libraries_json ?? [])
            ->filter(fn (string $l): bool => in_array($l, self::ALLOWED_LIBRARIES, true))
            ->unique()
            ->values();

        $lines = [
            '\documentclass[tikz,border=4pt]{standalone}',
        ];

        foreach ($packages as $package) {
            $lines[] = "\\usepackage{{$package}}";
        }

        if ($libraries->isNotEmpty()) {
            $lines[] = '\\usetikzlibrary{'.$libraries->implode(', ').'}';
        }

        if ($packages->contains('pgfplots')) {
            $lines[] = '\pgfplotsset{compat=1.18}';
        }

        $lines[] = '\begin{document}';
        $lines[] = trim($figure->tikz_source);
        $lines[] = '\end{document}';

        return implode("\n", $lines)."\n";
    }
}
