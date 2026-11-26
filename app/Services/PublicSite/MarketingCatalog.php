<?php

namespace App\Services\PublicSite;

use App\Models\MarketingFeature;

class MarketingCatalog
{
    /**
     * Return all non-disabled features for public display.
     *
     * @return list<array{
     *     slug: string,
     *     title: string,
     *     summary: string,
     *     description: string,
     *     category: string,
     *     status: 'available'|'beta'|'planned',
     *     iconKey: string,
     *     featured: bool
     * }>
     */
    public function features(): array
    {
        $features = MarketingFeature::query()
            ->where('is_public', true)
            ->where('availability_status', '!=', 'disabled')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return $features->map(static fn (MarketingFeature $feature): array => [
            'slug' => $feature->slug,
            'title' => $feature->title,
            'summary' => $feature->summary,
            'description' => $feature->description,
            'category' => $feature->category,
            'status' => $feature->availability_status,
            'iconKey' => $feature->icon_key,
            'featured' => $feature->is_featured,
        ])->all();
    }

    /**
     * Return the baseline catalog used by the repeatable feature seeder.
     *
     * @return list<array{
     *     slug: string,
     *     title: string,
     *     summary: string,
     *     description: string,
     *     category: string,
     *     status: 'available'|'beta'|'planned',
     *     iconKey: string,
     *     featured: bool
     * }>
     */
    public function defaultFeatures(): array
    {
        return [
            [
                'slug' => 'latex-workspace',
                'title' => 'Structured LaTeX workspace',
                'summary' => 'Organize project files, bibliography entries, and figures in a focused source editor.',
                'description' => 'Edit multi-file LaTeX projects with syntax highlighting, project-wide label and citation completions, outline folding, and optimistic conflict protection.',
                'category' => 'Writing environment',
                'status' => 'available',
                'iconKey' => 'code',
                'featured' => true,
            ],
            [
                'slug' => 'live-pdf-compilation',
                'title' => 'Managed TeX Live compilation & PDF preview',
                'summary' => 'Compile manuscripts in a sandboxed TeX Live environment and inspect diagnostics alongside your PDF.',
                'description' => 'Choose pdfLaTeX, XeLaTeX, or LuaLaTeX, view normalized line-level errors and warnings, and retain your last successful PDF if a draft fails to compile.',
                'category' => 'Typesetting & PDF',
                'status' => 'available',
                'iconKey' => 'file-text',
                'featured' => true,
            ],
            [
                'slug' => 'bibliography-synctex',
                'title' => 'Bibliography & SyncTeX navigation',
                'summary' => 'Keep BibTeX references, citation keys, and source-to-PDF navigation close to your manuscript.',
                'description' => 'Inspect parsed BibTeX entries, catch unresolved citations or duplicate labels before compiling, and jump between LaTeX source lines and PDF pages.',
                'category' => 'Research workflow',
                'status' => 'available',
                'iconKey' => 'book',
                'featured' => true,
            ],
            [
                'slug' => 'coauthor-review',
                'title' => 'Co-author comments & change suggestions',
                'summary' => 'Coordinate feedback, review threads, and proposed edits with collaborators in one place.',
                'description' => 'Invite collaborators with role-based permissions, open anchored comment threads, and accept or reject suggested text changes.',
                'category' => 'Collaboration',
                'status' => 'available',
                'iconKey' => 'users',
                'featured' => true,
            ],
            [
                'slug' => 'ai-assistance',
                'title' => 'Human-reviewed AI assistance',
                'summary' => 'Use your own API key for error explanations and focused revision suggestions with explicit approval.',
                'description' => 'Connect your personal Gemini, OpenAI, or Anthropic API key in settings. AI suggestions are never applied automatically—every change requires your review.',
                'category' => 'AI assistance',
                'status' => 'available',
                'iconKey' => 'sparkles',
                'featured' => true,
            ],
            [
                'slug' => 'revisions-export',
                'title' => 'Named revisions & portable ZIP export',
                'summary' => 'Save project snapshots and export complete source archives whenever you need them.',
                'description' => 'Create named revision checkpoints before major edits and download your full LaTeX source tree at any time without lock-in.',
                'category' => 'Research workflow',
                'status' => 'available',
                'iconKey' => 'git-branch',
                'featured' => true,
            ],
            [
                'slug' => 'formula-hover-preview',
                'title' => 'Inline formula hover preview',
                'summary' => 'Inspect rendered mathematical expressions directly inside the LaTeX editor on hover.',
                'description' => 'Preview inline and display math equations cleanly as you write without waiting for a full document build.',
                'category' => 'Writing environment',
                'status' => 'available',
                'iconKey' => 'sigma',
                'featured' => false,
            ],
            [
                'slug' => 'visual-academic-tools',
                'title' => 'Visual table & diagram builders',
                'summary' => 'Create structured LaTeX tables and research diagrams through guided visual tools.',
                'description' => 'Planned guided editors for booktabs tables and TikZ/diagram snippets that output clean, editable LaTeX source.',
                'category' => 'Visual authoring tools',
                'status' => 'planned',
                'iconKey' => 'layout',
                'featured' => false,
            ],
            [
                'slug' => 'equation-ocr',
                'title' => 'Equation OCR capture',
                'summary' => 'Convert suitable equation images into editable LaTeX candidates with human verification.',
                'description' => 'Planned workflow to extract LaTeX math candidates from screenshots or scans for author inspection.',
                'category' => 'Visual authoring tools',
                'status' => 'planned',
                'iconKey' => 'scan',
                'featured' => false,
            ],
        ];
    }

    /**
     * Return featured capabilities for the home page.
     *
     * @return list<array{
     *     slug: string,
     *     title: string,
     *     summary: string,
     *     description: string,
     *     category: string,
     *     status: 'available'|'beta'|'planned',
     *     iconKey: string,
     *     featured: bool
     * }>
     */
    public function featuredFeatures(): array
    {
        return array_values(array_filter(
            $this->features(),
            static fn (array $item): bool => $item['featured']
        ));
    }

    /**
     * Return public FAQ items reflecting current product capabilities.
     *
     * @return list<array{id: string, question: string, answer: string}>
     */
    public function faqs(): array
    {
        return [
            [
                'id' => 'what-is-platform',
                'question' => 'What is LaTeX Studio?',
                'answer' => 'LaTeX Studio is an independent research-writing workspace combining a structured LaTeX code editor, managed TeX Live compilation, live PDF preview, collaboration threads, and optional user-keyed AI assistance.',
            ],
            [
                'id' => 'which-compilers',
                'question' => 'Which LaTeX compilers are supported?',
                'answer' => 'Projects compile inside a managed, sandboxed TeX Live environment behind our orchestration layer, supporting pdfLaTeX, XeLaTeX, and LuaLaTeX.',
            ],
            [
                'id' => 'preview-pdf',
                'question' => 'Can I inspect the PDF and build diagnostics while writing?',
                'answer' => 'Yes. Compiled PDFs render alongside your LaTeX source with normalized diagnostics for errors and warnings, and your last successful PDF remains available if a draft fails to build.',
            ],
            [
                'id' => 'collaborate',
                'question' => 'Can I collaborate with co-authors?',
                'answer' => 'Yes. Project owners can invite collaborators with role-based access, discuss sections through comment threads, and review proposed text suggestions.',
            ],
            [
                'id' => 'ai-control',
                'question' => 'How does AI assistance work, and are edits applied automatically?',
                'answer' => 'AI assistance is optional and uses your own API key (Gemini, OpenAI, or Anthropic) stored encrypted per user. Suggestions and error explanations are never applied automatically—you inspect and explicitly accept or reject every change.',
            ],
            [
                'id' => 'export-source',
                'question' => 'Can I export my LaTeX source files?',
                'answer' => 'Yes. You can export your complete project source tree as a portable ZIP archive at any time.',
            ],
        ];
    }
}
