<?php

namespace App\Enums;

enum CompilerEngine: string
{
    case PdfLaTeX = 'pdflatex';
    case XeLaTeX = 'xelatex';
    case LuaLaTeX = 'lualatex';

    public function label(): string
    {
        return match ($this) {
            self::PdfLaTeX => 'pdfLaTeX',
            self::XeLaTeX => 'XeLaTeX',
            self::LuaLaTeX => 'LuaLaTeX',
        };
    }
}
