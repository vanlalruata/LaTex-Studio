<?php

namespace Database\Seeders;

use App\Models\AiAction;
use App\Models\AiConversation;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class AiSeeder extends Seeder
{
    public function run(): void
    {
        $project = Project::query()->where('title', ProjectSeeder::DEMO_PROJECT_TITLE)->first();
        $researcher = User::query()->where('email', 'researcher@latexstudio.com')->first();

        if ($project === null || $researcher === null) {
            return;
        }

        $conversation = AiConversation::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'user_id' => $researcher->id,
                'title' => 'Tighten the methods section',
            ],
            [
                'provider' => 'openai',
                'model' => 'gpt-4o',
            ]
        );

        if ($conversation->wasRecentlyCreated) {
            $this->backdate($conversation, now()->subDays(3));
        }

        $methods = ProjectFile::query()
            ->where('project_id', $project->id)
            ->where('path', 'sections/03-methods.tex')
            ->first();

        $actions = [
            [
                'kind' => 'chat',
                'prompt' => 'Summarize the method in five bullet points for the co-author.',
                'response_text' => "1. Lift coarse fields into a spectral representation.\n2. Apply four complex-valued spectral blocks.\n3. Prune low-energy modes with a group-lasso penalty.\n4. Add a dry-static physics residual.\n5. Project back to the high-resolution grid.",
                'proposed_patch' => null,
                'status' => 'info',
                'file_id' => null,
                'at' => now()->subDays(3),
            ],
            [
                'kind' => 'compile_fix',
                'prompt' => 'Explain the undefined control sequence error from build 2 and how to fix it.',
                'response_text' => 'The log reports \\aligned, which is not a LaTeX environment. Use the amsmath environment aligned instead, or replace the block with an equation environment. The current source already uses equation, so rebuilding should clear the error.',
                'proposed_patch' => null,
                'status' => 'info',
                'file_id' => $methods?->id,
                'at' => now()->subDays(3)->addMinutes(20),
            ],
            [
                'kind' => 'paper_review',
                'prompt' => 'Review sections 1 to 3 for clarity, reproducibility, and unsupported claims.',
                'response_text' => "Findings:\n- The 18% RMSE improvement is stated in the abstract but the comparison table reports 0.412 vs 0.338, which is 18.0%. Consider stating the baseline explicitly.\n- The proposition assumes k_max proportional to N^(1/(2s+2)); define N before the proposition.\n- The annealing schedule should state the initial and final lambda values.\n- The TikZ caption mentions a skip path that is not drawn in the current figure.\n- No fabricated citations were introduced; all claims map to references in references.bib.",
                'proposed_patch' => null,
                'status' => 'info',
                'file_id' => $methods?->id,
                'at' => now()->subDays(2),
            ],
            [
                'kind' => 'chat',
                'prompt' => 'Rewrite the sparsity schedule paragraph so the annealing endpoints are explicit.',
                'response_text' => "Here is a tighter version of the paragraph.\n\n```json_patch\n{\"title\": \"Define annealing endpoints\", \"original_excerpt\": \"In practice we anneal the sparsity weight over the first thirty epochs.\", \"proposed_content\": \"In practice we anneal the sparsity weight $\\\\lambda$ from $10^{-4}$ to its final value over the first thirty epochs, then hold it fixed.\"}\n```",
                'proposed_patch' => [
                    'title' => 'Define annealing endpoints',
                    'original_excerpt' => 'In practice we anneal the sparsity weight over the first thirty epochs.',
                    'proposed_content' => 'In practice we anneal the sparsity weight $\\lambda$ from $10^{-4}$ to its final value over the first thirty epochs, then hold it fixed.',
                ],
                'status' => 'pending',
                'file_id' => $methods?->id,
                'at' => now()->subDays(1),
            ],
        ];

        foreach ($actions as $action) {
            $record = AiAction::query()->updateOrCreate(
                [
                    'conversation_id' => $conversation->id,
                    'kind' => $action['kind'],
                    'prompt' => $action['prompt'],
                ],
                [
                    'project_id' => $project->id,
                    'user_id' => $researcher->id,
                    'project_file_id' => $action['file_id'],
                    'response_text' => $action['response_text'],
                    'proposed_patch' => $action['proposed_patch'],
                    'status' => $action['status'],
                ]
            );

            if ($record->wasRecentlyCreated) {
                $this->backdate($record, $action['at']);
            }
        }
    }

    private function backdate(Model $model, CarbonInterface $at): void
    {
        $model->timestamps = false;
        $model->forceFill(['created_at' => $at, 'updated_at' => $at])->save();
    }
}
