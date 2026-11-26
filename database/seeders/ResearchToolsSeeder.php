<?php

namespace Database\Seeders;

use App\Models\BibliographySource;
use App\Models\ConversionJob;
use App\Models\OcrJob;
use App\Models\Project;
use App\Models\ResearchAsset;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResearchToolsSeeder extends Seeder
{
    public function run(): void
    {
        $project = Project::query()->where('title', ProjectSeeder::DEMO_PROJECT_TITLE)->first();

        if ($project === null) {
            return;
        }

        $researcher = User::query()->where('email', 'researcher@latexstudio.com')->first();
        $coauthor = User::query()->where('email', 'coauthor@latexstudio.com')->first();

        if ($researcher === null || $coauthor === null) {
            return;
        }

        $this->seedAssets($project, $researcher, $coauthor);
        $this->seedBibliography($project, $researcher, $coauthor);
        $this->seedOcrJobs($project, $coauthor);
        $this->seedConversionJobs($project, $researcher, $coauthor);
    }

    private function seedAssets(Project $project, User $researcher, User $coauthor): void
    {
        $assets = [
            [
                'kind' => 'figure',
                'title' => 'Operator pipeline',
                'label' => 'fig:architecture',
                'caption' => 'Pipeline of the sparse Fourier neural operator with spectral pruning.',
                'payload' => [
                    'source' => "\\begin{tikzpicture}[node distance=1.2cm]\n  \\node[draw,rounded corners] (in) {Coarse};\n  \\node[draw,rounded corners,right=of in] (out) {Fine};\n  \\draw[-{Latex}] (in) -- (out);\n\\end{tikzpicture}",
                    'packages' => ['tikz'],
                    'width' => '0.9\\linewidth',
                ],
                'status' => 'ready',
                'created_by' => $coauthor->id,
            ],
            [
                'kind' => 'figure',
                'title' => 'Error decay by retained modes',
                'label' => 'fig:error-decay',
                'caption' => 'Held-out RMSE as a function of retained spectral modes.',
                'payload' => [
                    'source' => "\\begin{tikzpicture}\n  \\draw[->] (0,0) -- (4,0) node[right] {modes};\n  \\draw[->] (0,0) -- (0,3) node[above] {RMSE};\n  \\draw[thick,blue] (0.2,2.6) .. controls (1.5,1.6) .. (3.8,0.5);\n\\end{tikzpicture}",
                    'packages' => ['tikz'],
                    'width' => '0.7\\linewidth',
                ],
                'status' => 'ready',
                'created_by' => $researcher->id,
            ],
            [
                'kind' => 'table',
                'title' => 'Benchmark comparison',
                'label' => 'tab:benchmark',
                'caption' => 'Held-out RMSE and parameter count across five regions.',
                'payload' => [
                    'columns' => ['Model', 'RMSE', 'Params (M)', 'Train (h)'],
                    'rows' => [
                        ['U-Net', '0.412', '31.4', '18.2'],
                        ['FNO-2D', '0.361', '24.8', '21.7'],
                        ['Sparse FNO', '0.338', '18.3', '19.5'],
                    ],
                    'booktabs' => true,
                    'placement' => 't',
                ],
                'status' => 'ready',
                'created_by' => $researcher->id,
            ],
            [
                'kind' => 'table',
                'title' => 'Ablation study',
                'label' => 'tab:ablation',
                'caption' => 'Ablation of the physics residual and the sparsity penalty.',
                'payload' => [
                    'columns' => ['Variant', 'RMSE', 'Params (M)'],
                    'rows' => [
                        ['Full model', '0.338', '18.3'],
                        ['No physics residual', '0.352', '18.3'],
                        ['No sparsity penalty', '0.344', '29.5'],
                    ],
                    'booktabs' => true,
                    'placement' => 't',
                ],
                'status' => 'draft',
                'created_by' => $coauthor->id,
            ],
            [
                'kind' => 'equation',
                'title' => 'Training objective',
                'label' => 'eq:operator-loss',
                'caption' => 'Data fidelity, group-lasso penalty, and physics residual.',
                'payload' => [
                    'latex' => '\\mathcal{L}(\\theta)=\\frac{1}{N}\\sum_{i=1}^{N}\\norm{\\mathcal{G}_\\theta(a_i)-u_i}_2^2+\\lambda\\sum_{\\ell=1}^{L}\\norm{W_\\ell}_1+\\mu\\mathcal{R}_{\\mathrm{phys}}',
                    'numbered' => true,
                ],
                'status' => 'ready',
                'created_by' => $researcher->id,
            ],
            [
                'kind' => 'equation',
                'title' => 'Spectral kernel parameterization',
                'label' => 'eq:spectral-kernel',
                'caption' => 'Complex-valued linear map on retained Fourier modes.',
                'payload' => [
                    'latex' => '(\\mathcal{K}(\\theta)v)_k = R_k\\,(\\mathcal{F}v)_k,\\qquad k\\in\\{0,\\dots,k_{\\max}\\}',
                    'numbered' => true,
                ],
                'status' => 'ready',
                'created_by' => $coauthor->id,
            ],
        ];

        foreach ($assets as $asset) {
            ResearchAsset::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'kind' => $asset['kind'],
                    'title' => $asset['title'],
                ],
                [
                    'created_by' => $asset['created_by'],
                    'label' => $asset['label'],
                    'caption' => $asset['caption'],
                    'payload' => $asset['payload'],
                    'status' => $asset['status'],
                ]
            );
        }
    }

    private function seedBibliography(Project $project, User $researcher, User $coauthor): void
    {
        $sources = [
            [
                'key' => 'li2021fourier',
                'provider' => 'crossref',
                'title' => 'Fourier Neural Operator for Parametric Partial Differential Equations',
                'authors' => ['Zongyi Li', 'Nikola Kovachki', 'Kamyar Azizzadenesheli', 'Burigede Liu', 'Kaushik Bhattacharya', 'Andrew Stuart', 'Anima Anandkumar'],
                'year' => 2021,
                'venue' => 'International Conference on Learning Representations',
                'doi' => '10.48550/arXiv.2010.08895',
                'url' => 'https://arxiv.org/abs/2010.08895',
                'is_imported' => true,
                'added_by' => $researcher->id,
            ],
            [
                'key' => 'kovachki2023neural',
                'provider' => 'crossref',
                'title' => 'Neural Operator: Learning Maps Between Function Spaces',
                'authors' => ['Nikola Kovachki', 'Zongyi Li', 'Burigede Liu', 'Kamyar Azizzadenesheli', 'Kaushik Bhattacharya', 'Andrew Stuart', 'Anima Anandkumar'],
                'year' => 2023,
                'venue' => 'Journal of Machine Learning Research',
                'doi' => '10.5555/3648699.3648957',
                'url' => 'https://jmlr.org/papers/v24/21-1524.html',
                'is_imported' => true,
                'added_by' => $researcher->id,
            ],
            [
                'key' => 'pathak2022fourcastnet',
                'provider' => 'manual',
                'title' => 'FourCastNet: A Global Data-driven High-resolution Weather Model using Adaptive Fourier Neural Operators',
                'authors' => ['Jaideep Pathak', 'Shashank Subramanian', 'Peter Harrington', 'Sanjeev Raja'],
                'year' => 2022,
                'venue' => 'arXiv preprint arXiv:2202.11214',
                'doi' => '10.48550/arXiv.2202.11214',
                'url' => 'https://arxiv.org/abs/2202.11214',
                'is_imported' => false,
                'added_by' => $coauthor->id,
            ],
            [
                'key' => 'raissi2019physics',
                'provider' => 'doi',
                'title' => 'Physics-informed Neural Networks',
                'authors' => ['Maziar Raissi', 'Paris Perdikaris', 'George E. Karniadakis'],
                'year' => 2019,
                'venue' => 'Journal of Computational Physics',
                'doi' => '10.1016/j.jcp.2018.10.045',
                'url' => 'https://doi.org/10.1016/j.jcp.2018.10.045',
                'is_imported' => true,
                'added_by' => $researcher->id,
            ],
        ];

        foreach ($sources as $source) {
            BibliographySource::query()->updateOrCreate(
                ['project_id' => $project->id, 'key' => $source['key']],
                [
                    'added_by' => $source['added_by'],
                    'provider' => $source['provider'],
                    'title' => $source['title'],
                    'authors' => $source['authors'],
                    'year' => $source['year'],
                    'venue' => $source['venue'],
                    'doi' => $source['doi'],
                    'url' => $source['url'],
                    'raw_bibtex' => null,
                    'is_imported' => $source['is_imported'],
                ]
            );
        }
    }

    private function seedOcrJobs(Project $project, User $coauthor): void
    {
        OcrJob::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'source_filename' => 'handwritten-loss-derivation.png',
            ],
            [
                'user_id' => $coauthor->id,
                'status' => 'completed',
                'mime_type' => 'image/png',
                'languages' => 'eng',
                'extracted_latex' => <<<'TEX'
\begin{equation}
\mathcal{L}(\theta)
= \frac{1}{N}\sum_{i=1}^{N}\norm{\mathcal{G}_\theta(a_i)-u_i}_2^2
+ \lambda\sum_{\ell=1}^{L}\norm{W_\ell}_1
\end{equation}
TEX,
                'confidence' => '96.40',
                'error_message' => null,
            ]
        );

        OcrJob::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'source_filename' => 'scanned-reviewer-notes.pdf',
            ],
            [
                'user_id' => $coauthor->id,
                'status' => 'failed',
                'mime_type' => 'application/pdf',
                'languages' => 'eng',
                'extracted_latex' => null,
                'confidence' => null,
                'error_message' => 'Low contrast scan. Retry with a 300 DPI source and the eng+deu language set.',
            ]
        );
    }

    private function seedConversionJobs(Project $project, User $researcher, User $coauthor): void
    {
        ConversionJob::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'input_filename' => 'coauthor-draft.docx',
            ],
            [
                'user_id' => $coauthor->id,
                'status' => 'completed',
                'direction' => 'docx_to_latex',
                'engine' => 'pandoc',
                'output_filename' => 'imports/coauthor-draft.tex',
                'log_excerpt' => "Converted 34 paragraphs, 6 equations, and 2 tables.\nWarnings: 1 unresolved cross-reference.",
            ]
        );

        ConversionJob::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'input_filename' => 'camera-ready-export',
            ],
            [
                'user_id' => $researcher->id,
                'status' => 'queued',
                'direction' => 'latex_to_docx',
                'engine' => 'pandoc',
                'output_filename' => null,
                'log_excerpt' => null,
            ]
        );

        ConversionJob::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'input_filename' => 'notes.md',
            ],
            [
                'user_id' => $coauthor->id,
                'status' => 'failed',
                'direction' => 'markdown_to_latex',
                'engine' => 'pandoc',
                'output_filename' => null,
                'log_excerpt' => 'Pandoc exited with status 1: unsupported raw HTML block at line 42.',
            ]
        );
    }
}
