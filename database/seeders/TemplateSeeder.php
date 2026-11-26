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
            [
                'slug' => 'ieee-conference-paper',
                'title' => 'IEEE Conference Paper',
                'category' => 'conference',
                'description' => 'Two-column IEEEtran manuscript with numbered citations and a booktabs results table.',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'files_manifest' => [
                    [
                        'path' => 'main.tex',
                        'content' => <<<'TEX'
\documentclass[conference]{IEEEtran}
\usepackage{amsmath,amssymb,booktabs}
\usepackage{cite}

\title{A Concise Conference Manuscript}
\author{\IEEEauthorblockN{Dr. Researcher}\IEEEauthorblockA{ReasLab Research Group}}

\begin{document}
\maketitle

\begin{abstract}
This template demonstrates a two-column IEEE conference layout with numbered citations and a compact results table.
\end{abstract}

\section{Introduction}
Conference papers reward concise claims backed by reproducible evidence \cite{knuth1984texbook}.

\section{Results}
\begin{table}[t]
\centering
\caption{Accuracy comparison.}
\begin{tabular}{lcc}
\toprule
Model & Accuracy & Params (M) \\
\midrule
Baseline & 0.812 & 24.1 \\
Ours & 0.847 & 18.6 \\
\bottomrule
\end{tabular}
\end{table}

\bibliographystyle{IEEEtran}
\bibliography{references}

\end{document}
TEX,
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
                'slug' => 'tikz-research-poster',
                'title' => 'TikZ Research Poster',
                'category' => 'poster',
                'description' => 'Large-format poster with a three-column layout and a TikZ pipeline diagram.',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'files_manifest' => [
                    [
                        'path' => 'poster.tex',
                        'content' => <<<'TEX'
\documentclass[12pt]{article}
\usepackage[paperwidth=36in,paperheight=24in,margin=1in]{geometry}
\usepackage{amsmath,booktabs,tikz,multicol}
\usetikzlibrary{arrows.meta,positioning}
\pagestyle{empty}

\begin{document}
\begin{center}
{\Huge\bfseries Sparse Operators for Climate Downscaling}\\[0.5em]
{\Large Dr. Researcher \quad Co-Author}
\end{center}

\begin{multicols}{3}
\section*{Motivation}
Impact studies need kilometre-scale fields that coarse climate models cannot resolve directly.

\section*{Method}
\begin{center}
\begin{tikzpicture}[node distance=1.2cm]
  \node[draw,rounded corners] (a) {Coarse};
  \node[draw,rounded corners,right=of a] (b) {Spectral};
  \node[draw,rounded corners,right=of b] (c) {Fine};
  \draw[-{Latex}] (a) -- (b);
  \draw[-{Latex}] (b) -- (c);
\end{tikzpicture}
\end{center}

\section*{Results}
\begin{tabular}{lcc}
\toprule
Model & RMSE & Params \\
\midrule
U-Net & 0.412 & 31.4M \\
Ours & 0.338 & 18.3M \\
\bottomrule
\end{tabular}

\section*{Reproducibility}
Every number links to a project revision and a build artifact.
\end{multicols}

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
