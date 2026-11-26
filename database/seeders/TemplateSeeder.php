<?php

namespace Database\Seeders;

use App\Enums\CompilerEngine;
use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'slug' => 'basic-research-article',
                'title' => 'Basic Research Article',
                'category' => 'article',
                'description' => 'Clean single-file academic article with geometry, amsmath, booktabs, and hyperref.',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'files_manifest' => [
                    [
                        'path' => 'main.tex',
                        'content' => <<<'TEX'
\documentclass[11pt]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb,booktabs}
\usepackage{xcolor}
\usepackage[colorlinks=true,linkcolor=blue]{hyperref}

\title{A Reproducible LaTeX Workflow}
\author{Dr. Researcher}
\date{\today}

\begin{document}
\maketitle

\begin{abstract}
This short report demonstrates an integrated writing workflow with intelligent editing, PDF preview, diagnostics, and source synchronization.
\end{abstract}

\section{Introduction}
LaTeX Studio keeps source code, project files, and the compiled document in one workspace. Edit any part of the report while the preview remains visible beside the source.

\subsection{Research Question}
We study a regularized least-squares model for estimating a parameter vector $\boldsymbol{\theta}$ from observations $\mathbf{y}$.

\section{Model}
The objective combines data fidelity with an $\ell_2$ penalty:
\begin{equation}\label{eq:objective}
    \hat{\boldsymbol{\theta}} = \arg\min_{\boldsymbol{\theta}} \left\| \mathbf{X}\boldsymbol{\theta} - \mathbf{y} \right\|_2^2 + \lambda \|\boldsymbol{\theta}\|_2^2.
\end{equation}

\end{document}
TEX,
                    ],
                    [
                        'path' => 'README.md',
                        'content' => "# Basic Research Article\n\nStarter template for single-file manuscripts.\n",
                    ],
                ],
            ],
            [
                'slug' => 'multifile-thesis-biber',
                'title' => 'Multi-File Thesis (BibLaTeX + Biber)',
                'category' => 'thesis',
                'description' => 'Structured thesis/report with modular chapter inputs and a BibLaTeX bibliography.',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'files_manifest' => [
                    [
                        'path' => 'main.tex',
                        'content' => <<<'TEX'
\documentclass[11pt]{report}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb,booktabs}
\usepackage[backend=biber,style=numeric]{biblatex}
\addbibresource{references.bib}

\title{Structured Research Thesis}
\author{Dr. Researcher}
\date{\today}

\begin{document}
\maketitle
\tableofcontents

\input{chapters/01-introduction}

\printbibliography
\end{document}
TEX,
                    ],
                    [
                        'path' => 'chapters/01-introduction.tex',
                        'content' => "\\chapter{Introduction}\nThis chapter introduces the research problem and cites \\cite{knuth1984texbook}.\n",
                    ],
                    [
                        'path' => 'references.bib',
                        'content' => <<<'BIB'
@book{knuth1984texbook,
  title     = {The TeXbook},
  author    = {Knuth, Donald E.},
  year      = {1984},
  publisher = {Addison-Wesley}
}
BIB,
                    ],
                ],
            ],
            [
                'slug' => 'xelatex-multilingual-report',
                'title' => 'XeLaTeX Unicode Report',
                'category' => 'report',
                'description' => 'Unicode-ready report configured for XeLaTeX and fontspec.',
                'compiler_engine' => CompilerEngine::XeLaTeX,
                'files_manifest' => [
                    [
                        'path' => 'main.tex',
                        'content' => <<<'TEX'
\documentclass[11pt]{article}
\usepackage{fontspec}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath}

\title{Unicode Technical Report}
\author{Dr. Researcher}
\date{\today}

\begin{document}
\maketitle

\section{Overview}
Configured for native UTF-8 and OpenType fonts via XeLaTeX.

\end{document}
TEX,
                    ],
                ],
            ],
        ];

        foreach ($templates as $template) {
            Template::query()->updateOrCreate(
                ['slug' => $template['slug']],
                [
                    'title' => $template['title'],
                    'category' => $template['category'],
                    'description' => $template['description'],
                    'compiler_engine' => $template['compiler_engine'],
                    'files_manifest' => $template['files_manifest'],
                    'is_public' => true,
                ]
            );
        }
    }
}
