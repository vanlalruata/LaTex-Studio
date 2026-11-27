<?php

namespace App\Http\Controllers;

use App\Http\Requests\BibliographyLookupRequest;
use App\Models\Project;
use App\Services\Bibliography\ArxivLookupService;
use App\Services\Bibliography\CrossRefLookupService;
use App\Services\Bibliography\DoiLookupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class BibliographyLookupController extends Controller
{
    public function __invoke(
        BibliographyLookupRequest $request,
        Project $project,
        CrossRefLookupService $crossRef,
        ArxivLookupService $arxiv,
        DoiLookupService $doi,
    ): JsonResponse {
        Gate::authorize('view', $project);

        $validated = $request->validated();
        $provider = match ($validated['provider']) {
            'arxiv' => $arxiv,
            'doi' => $doi,
            default => $crossRef,
        };

        $mode = $validated['mode'] ?? ($validated['provider'] === 'doi' ? 'lookup' : 'search');
        $query = $validated['query'];

        if ($mode === 'lookup') {
            $item = $provider->lookup($query);

            return response()->json([
                'results' => $item !== null ? [$item] : [],
            ]);
        }

        return response()->json([
            'results' => $provider->search($query, 10),
        ]);
    }
}
