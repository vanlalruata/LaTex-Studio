<?php

namespace App\Domain\Equations;

use App\Models\Equation;

class StandaloneEquationBuilder
{
    /** @var list<string> */
    private const ALLOWED_PACKAGES = [
        'amsmath',
        'amssymb',
        'amsthm',
        'bm',
        'mathtools',
        'mhchem',
        'siunitx',
    ];

    public function build(Equation $equation): string
    {
        $packages = collect($equation->package_requirements_json ?? ['amsmath', 'amssymb'])
            ->filter(fn (string $p): bool => in_array($p, self::ALLOWED_PACKAGES, true))
            ->unique()
            ->values();

        if (! $packages->contains('amsmath')) {
            $packages->prepend('amsmath');
        }

        $lines = ['\documentclass[border=6pt,varwidth]{standalone}'];
        foreach ($packages as $pkg) {
            $lines[] = "\\usepackage{{$pkg}}";
        }
        $lines[] = '\begin{document}';

        $src = trim($equation->latex_source);
        $hasEnv = str_starts_with($src, '\begin{') || str_starts_with($src, '\[') || str_starts_with($src, '$');
        if ($hasEnv) {
            $lines[] = $src;
        } elseif ($equation->math_mode === 'inline') {
            $lines[] = "\${$src}\$";
        } else {
            $lines[] = "\\[\n{$src}\n\\]";
        }

        $lines[] = '\end{document}';

        return implode("\n", $lines)."\n";
    }
}
