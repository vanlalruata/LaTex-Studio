<?php

namespace App\Http\Controllers;

use App\Models\BibliographySource;
use App\Models\Project;
use App\Services\Bibliography\BibTexGenerator;
use App\Services\Bibliography\BibTexParser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class BibliographyController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $query = $project->bibliographySources()->latest('created_at');

        $search = $request->query('q');
        if (is_string($search) && trim($search) !== '') {
            $term = '%'.trim($search).'%';
            $query->where(function ($builder) use ($term): void {
                $builder->where('title', 'like', $term)
                    ->orWhere('key', 'like', $term)
                    ->orWhere('venue', 'like', $term)
                    ->orWhere('doi', 'like', $term)
                    ->orWhere('authors', 'like', $term);
            });
        }

        $sources = $query->limit(200)->get()->map(
            fn (BibliographySource $source): array => $this->payload($source)
        )->values();

        return response()->json(['sources' => $sources]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'key' => [
                'nullable',
                'string',
                'max:120',
                'regex:/^[A-Za-z0-9_:.-]+$/',
                Rule::unique('bibliography_sources', 'key')->where('project_id', $project->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'authors' => ['nullable', 'array', 'max:50'],
            'authors.*' => ['string', 'max:200'],
            'year' => ['nullable', 'integer', 'min:1000', 'max:2999'],
            'venue' => ['nullable', 'string', 'max:255'],
            'doi' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:512'],
            'raw_bibtex' => ['nullable', 'string', 'max:20000'],
            'provider' => ['nullable', Rule::in(['manual', 'crossref', 'doi', 'arxiv', 'zotero'])],
        ]);

        $key = $validated['key'] ?? $this->deriveKey($validated['title'], $validated['authors'] ?? [], $validated['year'] ?? null);

        $existingKey = $project->bibliographySources()->where('key', $key)->exists();
        if ($existingKey) {
            $key .= '-'.substr(hash('sha256', $validated['title'].microtime(true)), 0, 6);
        }

        $source = $project->bibliographySources()->create([
            'added_by' => $request->user()?->id,
            'provider' => $validated['provider'] ?? 'manual',
            'key' => $key,
            'title' => $validated['title'],
            'authors' => $validated['authors'] ?? null,
            'year' => $validated['year'] ?? null,
            'venue' => $validated['venue'] ?? null,
            'doi' => $validated['doi'] ?? null,
            'url' => $validated['url'] ?? null,
            'raw_bibtex' => $validated['raw_bibtex'] ?? null,
            'is_imported' => isset($validated['raw_bibtex']) && $validated['raw_bibtex'] !== null,
        ]);

        return response()->json(['source' => $this->payload($source)], 201);
    }

    public function destroy(Project $project, BibliographySource $source): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($source->project_id === $project->id, 404);

        $source->delete();

        return response()->json(['deleted' => true]);
    }

    public function importBib(
        Request $request,
        Project $project,
        BibTexParser $parser,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'bibtex' => ['required', 'string', 'max:200000'],
        ]);

        $parsed = $parser->parse($validated['bibtex']);
        $created = [];

        foreach ($parsed['entries'] as $entry) {
            $key = $entry['key'];
            if ($project->bibliographySources()->where('key', $key)->exists()) {
                $key .= '-'.substr(hash('sha256', $entry['title'].microtime(true)), 0, 6);
            }

            $source = $project->bibliographySources()->create([
                'added_by' => $request->user()?->id,
                'provider' => 'manual',
                'key' => $key,
                'title' => $entry['title'],
                'authors' => $entry['authors'],
                'year' => $entry['year'],
                'venue' => $entry['venue'],
                'doi' => $entry['doi'],
                'url' => $entry['url'],
                'raw_bibtex' => $entry['raw_bibtex'],
                'is_imported' => true,
            ]);

            $created[] = $this->payload($source);
        }

        return response()->json([
            'imported_count' => count($created),
            'sources' => $created,
            'errors' => $parsed['errors'],
        ], 201);
    }

    public function exportBib(Project $project, BibTexGenerator $generator): Response
    {
        Gate::authorize('view', $project);

        $sources = $project->bibliographySources()
            ->orderBy('key')
            ->get();

        $content = $generator->generate($sources);

        return response($content, 200, [
            'Content-Type' => 'application/x-bibtex; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="references.bib"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /**
     * @param  array<int, string>  $authors
     */
    private function deriveKey(string $title, array $authors, ?int $year): string
    {
        $firstAuthor = $authors[0] ?? 'anon';
        $surname = strtolower(trim((string) preg_replace('/[^A-Za-z]+/', ' ', $firstAuthor)));
        $surname = explode(' ', trim($surname))[0] ?? 'anon';
        $word = strtolower((string) preg_replace('/[^A-Za-z]+/', '', explode(' ', $title)[0] ?? 'work'));

        return substr($surname.$year.$word, 0, 120) ?: 'source'.substr(hash('sha256', $title), 0, 8);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(BibliographySource $source): array
    {
        return [
            'public_id' => $source->public_id,
            'key' => $source->key,
            'provider' => $source->provider,
            'title' => $source->title,
            'authors' => $source->authors ?? [],
            'year' => $source->year,
            'venue' => $source->venue,
            'doi' => $source->doi,
            'url' => $source->url,
            'is_imported' => $source->is_imported,
            'citation' => '\\cite{'.$source->key.'}',
            'created_at' => $source->created_at?->toIso8601String(),
        ];
    }
}
