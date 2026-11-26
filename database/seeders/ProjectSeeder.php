<?php

namespace Database\Seeders;

use App\Domain\Files\PathValidator;
use App\Enums\ArtifactType;
use App\Enums\BuildProfile;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Enums\DiagnosticSeverity;
use App\Enums\ProjectRole;
use App\Models\BuildArtifact;
use App\Models\Compilation;
use App\Models\Diagnostic;
use App\Models\Organization;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectMember;
use App\Models\ProjectRevision;
use App\Models\Template;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Carbon\CarbonInterface;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public const DEMO_PROJECT_TITLE = 'Sparse Operator Learning for Climate Downscaling';

    public function run(): void
    {
        $researcher = User::query()->where('email', 'researcher@latexstudio.com')->first();
        $coauthor = User::query()->where('email', 'coauthor@latexstudio.com')->first();

        if ($researcher === null || $coauthor === null) {
            return;
        }

        $organization = Organization::query()->firstOrCreate(
            ['slug' => 'reaslab-research'],
            ['name' => 'ReasLab Research Group']
        );

        $organization->members()->syncWithoutDetaching([
            $researcher->id => ['role' => 'owner'],
            $coauthor->id => ['role' => 'member'],
        ]);

        $project = $this->seedClimateProject($organization, $researcher, $coauthor);
        $this->seedStarterProject($organization, $researcher, $coauthor);
        $this->seedMembers($project, $researcher);
    }

    private function seedClimateProject(Organization $organization, User $owner, User $coauthor): Project
    {
        $project = Project::query()->firstOrCreate(
            [
                'owner_id' => $owner->id,
                'title' => self::DEMO_PROJECT_TITLE,
            ],
            [
                'organization_id' => $organization->id,
                'description' => 'A reproducible study of sparse Fourier neural operators for statistical climate downscaling.',
                'root_file_path' => 'main.tex',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'build_profile' => BuildProfile::Research,
                'bibliography_tool' => 'biber',
                'auto_compile' => true,
            ]
        );

        ProjectMember::query()->updateOrCreate(
            ['project_id' => $project->id, 'user_id' => $coauthor->id],
            ['role' => ProjectRole::Editor, 'invited_by' => $owner->id]
        );

        $this->seedRevision(
            $project,
            $owner,
            'Kickoff snapshot (empty scaffold)',
            [],
            now()->subDays(21)
        );

        $manifest = $this->seedFiles($project, $owner, $this->climateProjectFiles());

        $this->seedRevision(
            $project,
            $owner,
            'Initial manuscript import',
            $manifest,
            now()->subDays(14)
        );

        $this->seedCompilations($project, $owner);

        $project->forceFill([
            'storage_bytes' => (int) $project->files()->sum('size_bytes'),
        ])->save();

        return $project;
    }

    private function seedStarterProject(Organization $organization, User $owner, User $coauthor): void
    {
        $project = Project::query()->firstOrCreate(
            [
                'owner_id' => $owner->id,
                'title' => 'A Reproducible LaTeX Workflow',
            ],
            [
                'organization_id' => $organization->id,
                'description' => 'Demonstration manuscript for reproducible research writing.',
                'root_file_path' => 'main.tex',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'build_profile' => BuildProfile::Standard,
                'bibliography_tool' => 'biber',
                'auto_compile' => true,
            ]
        );

        ProjectMember::query()->updateOrCreate(
            ['project_id' => $project->id, 'user_id' => $coauthor->id],
            ['role' => ProjectRole::Editor, 'invited_by' => $owner->id]
        );

        $template = Template::query()->where('slug', 'basic-research-article')->first();

        /** @var array<string, string> $files */
        $files = [];

        if ($template !== null) {
            foreach ($template->files_manifest as $entry) {
                $files[(string) $entry['path']] = (string) $entry['content'];
            }
        } else {
            $files['main.tex'] = "\\documentclass{article}\n\\begin{document}\nHello.\n\\end{document}\n";
        }

        $manifest = $this->seedFiles($project, $owner, $files);

        $this->seedRevision(
            $project,
            $owner,
            'Starter template import',
            $manifest,
            now()->subDays(30)
        );

        $project->forceFill([
            'storage_bytes' => (int) $project->files()->sum('size_bytes'),
        ])->save();
    }

    private function seedMembers(Project $project, User $owner): void
    {
        $members = [
            'reviewer@latexstudio.com' => ProjectRole::Reviewer,
            'commenter@latexstudio.com' => ProjectRole::Commenter,
            'viewer@latexstudio.com' => ProjectRole::Viewer,
        ];

        foreach ($members as $email => $role) {
            $user = User::query()->where('email', $email)->first();

            if ($user === null) {
                continue;
            }

            ProjectMember::query()->updateOrCreate(
                ['project_id' => $project->id, 'user_id' => $user->id],
                ['role' => $role, 'invited_by' => $owner->id]
            );
        }
    }

    /**
     * Store every file that changed and return the current revision manifest.
     *
     * @param  array<string, string>  $files
     * @return array<string, string>
     */
    private function seedFiles(Project $project, User $actor, array $files): array
    {
        $validator = app(PathValidator::class);
        $storage = app(PrivateStorageService::class);
        $manifest = [];

        foreach ($files as $rawPath => $content) {
            $path = $validator->normalize($rawPath);
            $checksum = hash('sha256', $content);
            $file = ProjectFile::query()->firstOrNew([
                'project_id' => $project->id,
                'path' => $path,
            ]);

            if (! $file->exists || $file->sha256_checksum !== $checksum) {
                $stored = $storage->putProjectFile($project->public_id, $content);

                $file->fill([
                    'project_id' => $project->id,
                    'path' => $path,
                    'storage_key' => $stored['storage_key'],
                    'mime_type' => $validator->inferMimeType($path),
                    'size_bytes' => $stored['size_bytes'],
                    'sha256_checksum' => $stored['sha256_checksum'],
                    'is_directory' => false,
                    'version' => $file->exists ? $file->version + 1 : 1,
                    'updated_by' => $actor->id,
                ])->save();
            }

            $manifest[$path] = (string) $file->sha256_checksum;
        }

        ksort($manifest);

        return $manifest;
    }

    /**
     * @param  array<string, string>  $manifest
     */
    private function seedRevision(Project $project, ?User $actor, string $message, array $manifest, CarbonInterface $at): ProjectRevision
    {
        ksort($manifest);
        $hash = hash('sha256', (string) json_encode($manifest));

        $revision = ProjectRevision::query()->firstOrCreate(
            ['project_id' => $project->id, 'revision_hash' => $hash],
            [
                'created_by' => $actor?->id,
                'manifest' => $manifest,
                'message' => $message,
            ]
        );

        if ($revision->wasRecentlyCreated) {
            $revision->timestamps = false;
            $revision->forceFill(['created_at' => $at, 'updated_at' => $at])->save();
        }

        return $revision;
    }

    private function seedCompilations(Project $project, User $actor): void
    {
        $revision = $project->revisions()
            ->where('message', 'Initial manuscript import')
            ->first() ?? $project->revisions()->latest('created_at')->first();

        $builds = [
            [
                'key' => 'seed-'.$project->public_id.'-build-1',
                'at' => now()->subDays(12),
                'status' => CompilationStatus::Published,
                'exit_code' => 0,
                'duration_ms' => 4821,
                'peak_memory_kb' => 184320,
                'error_summary' => null,
                'diagnostics' => [],
                'artifacts' => [ArtifactType::Pdf, ArtifactType::Log, ArtifactType::Aux],
            ],
            [
                'key' => 'seed-'.$project->public_id.'-build-2',
                'at' => now()->subDays(9),
                'status' => CompilationStatus::Failed,
                'exit_code' => 1,
                'duration_ms' => 1630,
                'peak_memory_kb' => 96256,
                'error_summary' => 'LaTeX failed: undefined control sequence \\aligned in sections/03-methods.tex on line 112.',
                'diagnostics' => [
                    [
                        'severity' => DiagnosticSeverity::Error,
                        'file_path' => 'sections/03-methods.tex',
                        'line' => 112,
                        'code' => 'Undefined control sequence',
                        'message' => 'Undefined control sequence: \\aligned',
                        'raw_excerpt' => "112: \\begin{aligned}\n113:   \\mathcal{L}(\\theta) &= ...",
                    ],
                    [
                        'severity' => DiagnosticSeverity::Warning,
                        'file_path' => 'sections/04-experiments.tex',
                        'line' => 88,
                        'code' => 'Overfull \\hbox',
                        'message' => 'Overfull \\hbox (14.2pt too wide) in paragraph.',
                        'raw_excerpt' => null,
                    ],
                    [
                        'severity' => DiagnosticSeverity::Warning,
                        'file_path' => 'sections/02-related-work.tex',
                        'line' => 34,
                        'code' => 'Citation undefined',
                        'message' => "Citation 'zhang2023climate' undefined.",
                        'raw_excerpt' => null,
                    ],
                ],
                'artifacts' => [ArtifactType::Log],
            ],
            [
                'key' => 'seed-'.$project->public_id.'-build-3',
                'at' => now()->subDays(7),
                'status' => CompilationStatus::TimedOut,
                'exit_code' => null,
                'duration_ms' => 180000,
                'peak_memory_kb' => 512000,
                'error_summary' => 'Compilation exceeded the 180s research profile limit.',
                'diagnostics' => [
                    [
                        'severity' => DiagnosticSeverity::Error,
                        'file_path' => 'main.tex',
                        'line' => null,
                        'code' => 'Timeout',
                        'message' => 'Build worker exceeded the wall-clock limit and was terminated.',
                        'raw_excerpt' => null,
                    ],
                ],
                'artifacts' => [ArtifactType::Log],
            ],
            [
                'key' => 'seed-'.$project->public_id.'-build-4',
                'at' => now()->subDays(2),
                'status' => CompilationStatus::Published,
                'exit_code' => 0,
                'duration_ms' => 5234,
                'peak_memory_kb' => 201728,
                'error_summary' => null,
                'diagnostics' => [
                    [
                        'severity' => DiagnosticSeverity::Warning,
                        'file_path' => 'sections/02-related-work.tex',
                        'line' => 34,
                        'code' => 'Underfull \\hbox',
                        'message' => 'Underfull \\hbox (badness 10000) in paragraph.',
                        'raw_excerpt' => null,
                    ],
                    [
                        'severity' => DiagnosticSeverity::Info,
                        'file_path' => 'main.tex',
                        'line' => null,
                        'code' => 'Output written',
                        'message' => 'Output written on main.pdf (12 pages, 421034 bytes).',
                        'raw_excerpt' => null,
                    ],
                ],
                'artifacts' => [ArtifactType::Pdf, ArtifactType::Log, ArtifactType::Synctex, ArtifactType::Aux],
            ],
        ];

        $published = [];

        foreach ($builds as $build) {
            $finishedAt = $build['at']->copy()->addMilliseconds((int) ($build['duration_ms'] ?? 0));

            $compilation = Compilation::query()->firstOrCreate(
                ['idempotency_key' => $build['key']],
                [
                    'project_id' => $project->id,
                    'revision_id' => $revision?->id,
                    'triggered_by' => $actor->id,
                    'compiler_engine' => CompilerEngine::PdfLaTeX,
                    'build_profile' => BuildProfile::Research,
                    'worker_image_digest' => 'sha256:seeded-texlive-2025',
                    'status' => $build['status'],
                    'exit_code' => $build['exit_code'],
                    'duration_ms' => $build['duration_ms'],
                    'peak_memory_kb' => $build['peak_memory_kb'],
                    'error_summary' => $build['error_summary'],
                    'started_at' => $build['at'],
                    'finished_at' => $finishedAt,
                ]
            );

            if ($compilation->wasRecentlyCreated) {
                $compilation->timestamps = false;
                $compilation->forceFill([
                    'created_at' => $build['at'],
                    'updated_at' => $build['at'],
                ])->save();
            }

            foreach ($build['diagnostics'] as $diagnostic) {
                Diagnostic::query()->firstOrCreate(
                    [
                        'compilation_id' => $compilation->id,
                        'message' => $diagnostic['message'],
                    ],
                    [
                        'severity' => $diagnostic['severity'],
                        'file_path' => $diagnostic['file_path'],
                        'line' => $diagnostic['line'],
                        'column' => null,
                        'code' => $diagnostic['code'],
                        'raw_excerpt' => $diagnostic['raw_excerpt'],
                    ]
                );
            }

            $this->seedArtifacts($compilation, $build['artifacts'], $finishedAt);

            if ($build['status'] === CompilationStatus::Published) {
                $published[] = $compilation;
            }
        }

        $latestPublished = collect($published)->sortByDesc('created_at')->first();

        if ($latestPublished !== null) {
            $project->forceFill([
                'last_successful_compilation_id' => $latestPublished->id,
            ])->save();
        }
    }

    /**
     * @param  list<ArtifactType>  $types
     */
    private function seedArtifacts(Compilation $compilation, array $types, CarbonInterface $at): void
    {
        $storage = app(PrivateStorageService::class);

        foreach ($types as $type) {
            [$filename, $contents] = match ($type) {
                ArtifactType::Pdf => [
                    'main.pdf',
                    $this->minimalPdf(
                        'Sparse Operator Learning for Climate Downscaling',
                        'Seeded build artifact - 12 pages'
                    ),
                ],
                ArtifactType::Log => [
                    'main.log',
                    "This is pdfTeX, Version 3.141592653\nEntire job took 5.2s\nOutput written on main.pdf (12 pages).\n",
                ],
                ArtifactType::Synctex => [
                    'main.synctex',
                    "SyncTeX Version:1\nInput:1:main.tex\nOutput:pdf\n",
                ],
                ArtifactType::Aux => [
                    'main.aux',
                    "\\relax\n\\providecommand\\HyperFirstAtBeginDocument{\\AtBeginDocument}\n\\@writefile{toc}{\\contentsline {section}{\\numberline {1}Introduction}{1}}\n",
                ],
            };

            $stored = $storage->putBuildArtifact($compilation->public_id, $filename, $contents);

            $artifact = BuildArtifact::query()->firstOrNew([
                'compilation_id' => $compilation->id,
                'type' => $type->value,
            ]);

            $artifact->fill([
                'compilation_id' => $compilation->id,
                'type' => $type,
                'storage_key' => $stored['storage_key'],
                'sha256_checksum' => $stored['sha256_checksum'],
                'size_bytes' => $stored['size_bytes'],
            ])->save();

            if ($artifact->wasRecentlyCreated) {
                $artifact->timestamps = false;
                $artifact->forceFill(['created_at' => $at, 'updated_at' => $at])->save();
            }
        }
    }

    /**
     * Build a small but structurally valid PDF so the seeded preview renders.
     */
    private function minimalPdf(string $title, string $subtitle): string
    {
        $stream = 'BT /F1 20 Tf 72 760 Td ('.$this->pdfEscape($title).") Tj ET\n"
            .'BT /F1 11 Tf 72 735 Td ('.$this->pdfEscape($subtitle).") Tj ET\n";

        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
            '<< /Length '.strlen($stream)." >>\nstream\n".$stream.'endstream',
        ];

        $pdf = "%PDF-1.4\n";
        $offsets = [];

        foreach ($objects as $index => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($index + 1)." 0 obj\n".$object."\nendobj\n";
        }

        $xrefOffset = strlen($pdf);
        $size = count($objects) + 1;

        $pdf .= "xref\n0 ".$size."\n0000000000 65535 f \n";

        foreach ($offsets as $offset) {
            $pdf .= str_pad((string) $offset, 10, '0', STR_PAD_LEFT)." 00000 n \n";
        }

        $pdf .= "trailer\n<< /Size ".$size." /Root 1 0 R >>\nstartxref\n".$xrefOffset."\n%%EOF\n";

        return $pdf;
    }

    private function pdfEscape(string $value): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $value);
    }

    /**
     * @return array<string, string>
     */
    private function climateProjectFiles(): array
    {
        return [
            'main.tex' => <<<'TEX'
\documentclass[11pt]{article}
\input{preamble}

\title{Sparse Operator Learning for Climate Downscaling}
\author{Dr. Researcher \and Co-Author\\
  ReasLab Research Group}
\date{\today}

\begin{document}
\maketitle

\begin{abstract}
We study sparse operator learning for statistical downscaling of coarse climate simulations to high-resolution fields. The approach combines Fourier neural operators with structured sparsity and a physics-informed training objective. Across five held-out regions the model reduces root-mean-square error by 18\% relative to a U-Net baseline while using 42\% fewer parameters. The training pipeline, evaluation scripts, and build records are packaged as a reproducible LaTeX project.
\end{abstract}

\input{sections/01-introduction}
\input{sections/02-related-work}
\input{sections/03-methods}
\input{sections/04-experiments}
\input{sections/05-discussion}
\input{sections/06-reproducibility}

\appendix
\input{appendix/a-proofs}

\printbibliography
\end{document}
TEX,
            'preamble.tex' => <<<'TEX'
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb,amsthm,mathtools}
\usepackage{booktabs}
\usepackage{graphicx}
\usepackage{xcolor}
\usepackage{tikz}
\usetikzlibrary{arrows.meta,positioning,calc}
\usepackage[backend=biber,style=numeric,sortcites]{biblatex}
\addbibresource{references.bib}

\newtheorem{theorem}{Theorem}
\newtheorem{proposition}{Proposition}
\newcommand{\R}{\mathbb{R}}
\newcommand{\E}{\mathbb{E}}
\newcommand{\norm}[1]{\left\lVert #1 \right\rVert}
TEX,
            'sections/01-introduction.tex' => <<<'TEX'
\section{Introduction}
\label{sec:introduction}

Global climate models resolve the atmosphere at tens of kilometres, while impact studies often require fields at one to four kilometres. Statistical downscaling closes this gap by learning a map from coarse predictors to high-resolution targets. Recent work on neural operators \cite{li2021fourier,kovachki2023neural} shows that discretization-invariant architectures can approximate such maps directly from data, and large-scale systems such as FourCastNet \cite{pathak2022fourcastnet} demonstrate operational promise.

\paragraph{Contributions.}
This paper makes three contributions:
\begin{enumerate}
  \item A sparse Fourier neural operator that prunes spectral channels during training, described by the objective in Equation~\eqref{eq:operator-loss}.
  \item A physics-informed regularizer derived from the dry-static energy budget.
  \item A reproducible evaluation harness that snapshots code, data, and build artifacts for every reported number \cite{raissi2019physics}.
\end{enumerate}

Figure~\ref{fig:architecture} summarizes the pipeline and Table~\ref{tab:benchmark} reports held-out accuracy.
TEX,
            'sections/02-related-work.tex' => <<<'TEX'
\section{Related Work}
\label{sec:related}

Neural operators extend deep learning to function spaces \cite{li2021fourier,kovachki2023neural}. The Fourier neural operator parameterizes integral kernels in the spectral domain, which yields quasi-linear complexity in the number of retained modes. Weather-specific variants such as FourCastNet \cite{pathak2022fourcastnet} scale this idea to global reanalysis data.

Physics-informed training \cite{raissi2019physics} adds residual penalties that discourage solutions violating known conservation laws. Our regularizer follows this line but operates on spectral channels rather than collocation points.

Sparse training for scientific operators has been explored with magnitude pruning and variational dropout \cite{zhang2023climate}. We instead apply group-lasso penalties per spectral mode, which aligns sparsity with the frequency structure of the operator.
TEX,
            'sections/03-methods.tex' => <<<'TEX'
\section{Method}
\label{sec:method}

\input{equations/operator-loss}
\input{figures/architecture}

We parameterize the operator with four spectral blocks. Each block applies a truncated Fourier transform, a complex-valued linear map on the retained modes, and a pointwise residual connection. Let $k_{\max}$ denote the number of retained modes per axis and let $W_\ell$ collect the spectral weights of block $\ell$. The training objective in Equation~\eqref{eq:operator-loss} couples data fidelity, a group-lasso penalty, and a physics residual.

\begin{proposition}\label{prop:sparse-rate}
Assume the target operator is Lipschitz on the unit ball of $H^s$ with $s>1$ and that the retained modes satisfy $k_{\max}\asymp N^{1/(2s+2)}$. Then the pruned spectral estimator attains the parametric rate up to logarithmic factors.
\end{proposition}

The proof is deferred to Appendix~\ref{app:proof}. In practice we anneal the sparsity weight $\lambda$ over the first thirty epochs and keep the physics weight $\mu$ fixed at $10^{-3}$.
TEX,
            'sections/04-experiments.tex' => <<<'TEX'
\section{Experiments}
\label{sec:experiments}

\input{tables/benchmark}

We evaluate on five held-out regions: the Pacific Northwest, the Iberian Peninsula, the Nile Delta, coastal Chile, and southeastern Australia. Inputs are ERA5 reanalysis fields at $0.25^\circ$ resolution; targets are $0.04^\circ$ fields from a regional convection-permitting simulation.

All models are trained for ninety epochs with a batch size of sixteen on a single A100 GPU. We report the mean and standard deviation over three seeds. The sparse operator improves RMSE by 18\% relative to the U-Net baseline and by 6\% relative to a dense Fourier neural operator, while using fewer parameters.

\paragraph{Ablations.}
Removing the physics residual increases RMSE by 4.1\%. Removing the group-lasso penalty increases parameter count by 61\% without improving accuracy, confirming that the sparsity prior is doing useful work rather than merely compressing the model.
TEX,
            'sections/05-discussion.tex' => <<<'TEX'
\section{Discussion and Limitations}
\label{sec:discussion}

The sparse operator is most effective when the target field has a low-frequency dominant spectrum, as is typical for near-surface temperature and geopotential. For precipitation extremes, the spectral tail carries substantial energy and the pruning schedule must be relaxed.

Our evaluation uses a single regional simulation as ground truth. This choice keeps the study reproducible but limits claims about generalization to other convection-permitting models. A natural next step is a multi-model intercomparison with shared preprocessing.

Finally, the physics residual assumes a dry-static budget. Extending the regularizer to moist processes requires additional state variables and careful scaling.
TEX,
            'sections/06-reproducibility.tex' => <<<'TEX'
\section{Reproducibility}
\label{sec:reproducibility}

Every experiment is defined by a project revision and a build record. The revision manifest lists the SHA-256 checksum of each source file, and each build stores its compiler engine, build profile, diagnostics, and artifacts. To reproduce a reported number, check out the corresponding revision and rebuild with the recorded engine.

The repository ships with a pinned environment description, deterministic data splits, and evaluation scripts. Seeded demo data in this workspace includes a successful build, a failed build with diagnostics, and a timed-out build so that the build history can be inspected end to end.
TEX,
            'appendix/a-proofs.tex' => <<<'TEX'
\section{Proof of Proposition~\ref{prop:sparse-rate}}
\label{app:proof}

\begin{proof}
Let $\mathcal{G}$ denote the target operator and $\mathcal{G}_\theta$ the pruned spectral estimator. Decompose the error into approximation and estimation terms,
\begin{equation}
\norm{\mathcal{G}_\theta-\mathcal{G}} \leq \norm{\mathcal{G}_\theta-\mathcal{G}_{k_{\max}}} + \norm{\mathcal{G}_{k_{\max}}-\mathcal{G}},
\end{equation}
where $\mathcal{G}_{k_{\max}}$ retains the first $k_{\max}$ modes per axis. The second term decays at rate $k_{\max}^{-s}$ by the spectral smoothness assumption. The first term is controlled by the group-lasso penalty and the Lipschitz property on the unit ball. Balancing the two terms yields the stated rate up to logarithmic factors.
\end{proof}
TEX,
            'figures/architecture.tex' => <<<'TEX'
\begin{figure}[t]
\centering
\begin{tikzpicture}[node distance=1.4cm, every node/.style={font=\small}]
  \tikzset{
    block/.style={draw, rounded corners, fill=blue!8, minimum width=2.7cm, minimum height=0.9cm, align=center},
    arrow/.style={-{Latex[length=2mm]}, thick}
  }
  \node[block] (input) {Coarse fields\\$x\in\R^{H\times W}$};
  \node[block, right=of input] (lift) {Spectral lift\\$P$};
  \node[block, right=of lift] (blocks) {Sparse FNO\\blocks};
  \node[block, right=of blocks] (project) {Projection\\$Q$};
  \draw[arrow] (input) -- (lift);
  \draw[arrow] (lift) -- (blocks);
  \draw[arrow] (blocks) -- (project);
  \draw[arrow] (project) -- ++(1.2,0) node[right] {$\hat{y}$};
\end{tikzpicture}
\caption{Pipeline of the sparse Fourier neural operator. Spectral channels are pruned after each block, and the skip path preserves fine-scale residuals.}
\label{fig:architecture}
\end{figure}
TEX,
            'tables/benchmark.tex' => <<<'TEX'
\begin{table}[t]
\centering
\caption{Held-out RMSE (lower is better) and parameter count across five regions. Best results in bold.}
\label{tab:benchmark}
\begin{tabular}{lccc}
\toprule
Model & RMSE & Params (M) & Train (h) \\
\midrule
U-Net & 0.412 & 31.4 & 18.2 \\
FNO-2D & 0.361 & 24.8 & 21.7 \\
\textbf{Sparse FNO (ours)} & \textbf{0.338} & 18.3 & 19.5 \\
\bottomrule
\end{tabular}
\end{table}
TEX,
            'equations/operator-loss.tex' => <<<'TEX'
\begin{equation}
\label{eq:operator-loss}
\mathcal{L}(\theta)
= \underbrace{\frac{1}{N}\sum_{i=1}^{N}\norm{\mathcal{G}_\theta(a_i)-u_i}_2^2}_{\text{data fidelity}}
+ \lambda\sum_{\ell=1}^{L}\norm{W_\ell}_1
+ \mu\,\mathcal{R}_{\mathrm{phys}}(\mathcal{G}_\theta),
\end{equation}
where $N$ is the number of training pairs, $W_\ell$ are the spectral weights of block $\ell$, and $\mathcal{R}_{\mathrm{phys}}$ penalizes violations of the dry-static energy budget.
TEX,
            'references.bib' => <<<'BIB'
@article{li2021fourier,
  title   = {Fourier Neural Operator for Parametric Partial Differential Equations},
  author  = {Li, Zongyi and Kovachki, Nikola and Azizzadenesheli, Kamyar and Liu, Burigede and Bhattacharya, Kaushik and Stuart, Andrew and Anandkumar, Anima},
  journal = {International Conference on Learning Representations},
  year    = {2021}
}

@article{kovachki2023neural,
  title   = {Neural Operator: Learning Maps Between Function Spaces},
  author  = {Kovachki, Nikola and Li, Zongyi and Liu, Burigede and Azizzadenesheli, Kamyar and Bhattacharya, Kaushik and Stuart, Andrew and Anandkumar, Anima},
  journal = {Journal of Machine Learning Research},
  volume  = {24},
  number  = {89},
  pages   = {1--97},
  year    = {2023}
}

@article{pathak2022fourcastnet,
  title   = {FourCastNet: A Global Data-driven High-resolution Weather Model using Adaptive Fourier Neural Operators},
  author  = {Pathak, Jaideep and Subramanian, Shashank and Harrington, Peter and Raja, Sanjeev and Chattopadhyay, Ashesh and Mardani, Morteza and Kurth, Thorsten and Hall, David and Li, Zongyi and Azizzadenesheli, Kamyar and others},
  journal = {arXiv preprint arXiv:2202.11214},
  year    = {2022}
}

@article{raissi2019physics,
  title   = {Physics-informed Neural Networks: A Deep Learning Framework for Solving Forward and Inverse Problems Involving Nonlinear Partial Differential Equations},
  author  = {Raissi, Maziar and Perdikaris, Paris and Karniadakis, George E.},
  journal = {Journal of Computational Physics},
  volume  = {378},
  pages   = {686--707},
  year    = {2019},
  doi     = {10.1016/j.jcp.2018.10.045}
}

@article{zhang2023climate,
  title   = {Sparse Spectral Operators for Climate Downscaling},
  author  = {Zhang, Lina and Okafor, Samuel and Nair, Priya},
  journal = {Environmental Data Science},
  volume  = {2},
  pages   = {e14},
  year    = {2023},
  doi     = {10.1017/eds.2023.14}
}
BIB,
            'README.md' => <<<'MD'
# Sparse Operator Learning for Climate Downscaling

Demonstration manuscript for the LaTeX Studio research workspace.

## Structure
- `main.tex` — root document with abstract and includes
- `preamble.tex` — shared packages, theorem environments, macros
- `sections/` — introduction, related work, method, experiments, discussion, reproducibility
- `figures/architecture.tex` — TikZ pipeline diagram
- `tables/benchmark.tex` — booktabs results table
- `equations/operator-loss.tex` — training objective
- `appendix/a-proofs.tex` — proof of the sparse-rate proposition
- `references.bib` — BibLaTeX database compiled with Biber

## Build
Compile with pdfLaTeX and Biber using the `research` build profile.
MD,
        ];
    }
}
