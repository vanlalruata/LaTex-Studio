<?php

namespace Database\Seeders;

use App\Enums\SuggestionStatus;
use App\Models\ChangeSuggestion;
use App\Models\Comment;
use App\Models\CommentThread;
use App\Models\DocumentAnnotation;
use App\Models\Project;
use App\Models\ProjectChatMessage;
use App\Models\ProjectFile;
use App\Models\ReviewAssignment;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class CollaborationSeeder extends Seeder
{
    public function run(): void
    {
        $project = Project::query()->where('title', ProjectSeeder::DEMO_PROJECT_TITLE)->first();

        if ($project === null) {
            return;
        }

        $researcher = User::query()->where('email', 'researcher@latexstudio.com')->first();
        $coauthor = User::query()->where('email', 'coauthor@latexstudio.com')->first();
        $reviewer = User::query()->where('email', 'reviewer@latexstudio.com')->first();
        $commenter = User::query()->where('email', 'commenter@latexstudio.com')->first();

        if ($researcher === null || $coauthor === null || $reviewer === null || $commenter === null) {
            return;
        }

        $this->seedThreads($project, $researcher, $coauthor, $reviewer);
        $this->seedSuggestions($project, $researcher, $coauthor, $reviewer);
        $this->seedChat($project, $researcher, $coauthor, $reviewer);
        $this->seedReviewAssignments($project, $researcher, $coauthor, $reviewer, $commenter);
        $this->seedAnnotations($project, $researcher, $coauthor, $reviewer);
    }

    private function seedThreads(Project $project, User $researcher, User $coauthor, User $reviewer): void
    {
        $methods = $this->file($project, 'sections/03-methods.tex');
        $figure = $this->file($project, 'figures/architecture.tex');
        $discussion = $this->file($project, 'sections/05-discussion.tex');

        if ($methods !== null) {
            $thread = CommentThread::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'project_file_id' => $methods->id,
                    'start_line' => 6,
                    'end_line' => 12,
                    'created_by' => $coauthor->id,
                ],
                [
                    'quote_excerpt' => "\\input{equations/operator-loss}\n\\input{figures/architecture}",
                    'status' => 'open',
                    'resolved_by' => null,
                    'resolved_at' => null,
                ]
            );

            $this->comment($thread, $coauthor, 'Should we justify the group-lasso penalty before the proposition? A reader may not see why the spectral modes form natural groups.', now()->subDays(5));
            $this->comment($thread, $researcher, 'Good catch. I added one sentence after the equation and will expand it if the reviewer asks for more.', now()->subDays(4));
        }

        if ($figure !== null) {
            $thread = CommentThread::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'project_file_id' => $figure->id,
                    'start_line' => 3,
                    'end_line' => 10,
                    'created_by' => $reviewer->id,
                ],
                [
                    'quote_excerpt' => '\\node[block] (blocks) {Sparse FNO\\\\blocks};',
                    'status' => 'resolved',
                    'resolved_by' => $coauthor->id,
                    'resolved_at' => now()->subDays(6),
                ]
            );

            $this->comment($thread, $reviewer, 'Please label the skip connection explicitly. The caption mentions residuals but the diagram does not show the path.', now()->subDays(8));
            $this->comment($thread, $coauthor, 'Updated the TikZ node labels and added a dashed skip path. Resolving this thread.', now()->subDays(6));
        }

        if ($discussion !== null) {
            $thread = CommentThread::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'project_file_id' => $discussion->id,
                    'start_line' => 2,
                    'end_line' => 6,
                    'created_by' => $reviewer->id,
                ],
                [
                    'quote_excerpt' => 'The sparse operator is most effective when the target field has a low-frequency dominant spectrum.',
                    'status' => 'open',
                    'resolved_by' => null,
                    'resolved_at' => null,
                ]
            );

            $this->comment($thread, $reviewer, 'This claim needs a citation or a pointer to the ablation table. Right now it reads as an assertion.', now()->subDays(3));
        }
    }

    private function seedSuggestions(Project $project, User $researcher, User $coauthor, User $reviewer): void
    {
        $methods = $this->file($project, 'sections/03-methods.tex');
        $intro = $this->file($project, 'sections/01-introduction.tex');
        $experiments = $this->file($project, 'sections/04-experiments.tex');

        if ($methods !== null) {
            ChangeSuggestion::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'title' => 'Define the sparsity schedule before the proposition',
                ],
                [
                    'project_file_id' => $methods->id,
                    'proposed_by' => $researcher->id,
                    'original_excerpt' => 'In practice we anneal the sparsity weight $\\lambda$ over the first thirty epochs.',
                    'proposed_content' => 'In practice we anneal the sparsity weight $\\lambda$ from $10^{-4}$ to its final value over the first thirty epochs, then hold it fixed. This schedule keeps the spectral support stable during the later training phase.',
                    'start_line' => 28,
                    'end_line' => 30,
                    'source' => 'ai',
                    'status' => SuggestionStatus::Pending,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                ]
            );
        }

        if ($intro !== null) {
            ChangeSuggestion::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'title' => 'Tighten the contributions list',
                ],
                [
                    'project_file_id' => $intro->id,
                    'proposed_by' => $coauthor->id,
                    'original_excerpt' => 'This paper makes three contributions:',
                    'proposed_content' => 'We make three contributions: a sparse spectral operator, a physics-informed regularizer, and a reproducible evaluation harness.',
                    'start_line' => 8,
                    'end_line' => 12,
                    'source' => 'human',
                    'status' => SuggestionStatus::Accepted,
                    'reviewed_by' => $researcher->id,
                    'reviewed_at' => now()->subDays(4),
                ]
            );
        }

        if ($experiments !== null) {
            ChangeSuggestion::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'title' => 'Report variance across seeds',
                ],
                [
                    'project_file_id' => $experiments->id,
                    'proposed_by' => $reviewer->id,
                    'original_excerpt' => 'We report the mean and standard deviation over three seeds.',
                    'proposed_content' => 'We report the mean across three seeds; the standard deviation is below 0.004 RMSE for every region and is omitted from the table for space.',
                    'start_line' => 12,
                    'end_line' => 14,
                    'source' => 'human',
                    'status' => SuggestionStatus::Rejected,
                    'reviewed_by' => $researcher->id,
                    'reviewed_at' => now()->subDays(2),
                ]
            );
        }
    }

    private function seedChat(Project $project, User $researcher, User $coauthor, User $reviewer): void
    {
        $root = ProjectChatMessage::query()->firstOrCreate(
            [
                'project_id' => $project->id,
                'user_id' => $researcher->id,
                'body' => 'Pushed a new draft with the revised loss and the extra ablation paragraph.',
            ]
        );

        if ($root->wasRecentlyCreated) {
            $this->backdate($root, now()->subDays(4));
        }

        $this->reply($root, $coauthor, 'Reviewing section 4 now. The table alignment looks fine after the booktabs change.', now()->subDays(4)->addHours(2));
        $this->reply($root, $reviewer, 'I will check the appendix proof tonight and leave line comments.', now()->subDays(3));

        $rootTwo = ProjectChatMessage::query()->firstOrCreate(
            [
                'project_id' => $project->id,
                'user_id' => $coauthor->id,
                'body' => 'Zotero sync is on. The new climate-ML references are in references.bib and Biber runs clean.',
            ]
        );

        if ($rootTwo->wasRecentlyCreated) {
            $this->backdate($rootTwo, now()->subDays(2));
        }

        $this->reply($rootTwo, $researcher, 'Thanks. I resolved the undefined citation warning in the build log.', now()->subDays(2)->addHour());
    }

    private function seedReviewAssignments(Project $project, User $researcher, User $coauthor, User $reviewer, User $commenter): void
    {
        $benchmark = $this->file($project, 'tables/benchmark.tex');
        $appendix = $this->file($project, 'appendix/a-proofs.tex');

        ReviewAssignment::query()->updateOrCreate(
            ['project_id' => $project->id, 'title' => 'Review experiment tables'],
            [
                'project_file_id' => $benchmark?->id,
                'assignee_id' => $reviewer->id,
                'assigned_by' => $researcher->id,
                'instructions' => 'Check RMSE units, parameter counts, and that every baseline is cited.',
                'due_at' => now()->addDays(5),
                'status' => 'pending',
                'completed_at' => null,
            ]
        );

        ReviewAssignment::query()->updateOrCreate(
            ['project_id' => $project->id, 'title' => 'Proofread appendix A'],
            [
                'project_file_id' => $appendix?->id,
                'assignee_id' => $coauthor->id,
                'assigned_by' => $researcher->id,
                'instructions' => 'Verify the approximation and estimation decomposition.',
                'due_at' => now()->subDays(2),
                'status' => 'completed',
                'completed_at' => now()->subDays(2),
            ]
        );

        ReviewAssignment::query()->updateOrCreate(
            ['project_id' => $project->id, 'title' => 'Reproducibility audit'],
            [
                'project_file_id' => null,
                'assignee_id' => $commenter->id,
                'assigned_by' => $researcher->id,
                'instructions' => 'Follow the README from a clean checkout and confirm the reported build artifacts exist.',
                'due_at' => now()->addDays(12),
                'status' => 'in_progress',
                'completed_at' => null,
            ]
        );
    }

    private function seedAnnotations(Project $project, User $researcher, User $coauthor, User $reviewer): void
    {
        $intro = $this->file($project, 'sections/01-introduction.tex');
        $figure = $this->file($project, 'figures/architecture.tex');
        $benchmark = $this->file($project, 'tables/benchmark.tex');

        if ($intro !== null) {
            DocumentAnnotation::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'project_file_id' => $intro->id,
                    'start_line' => 5,
                    'kind' => 'highlight',
                ],
                [
                    'user_id' => $reviewer->id,
                    'end_line' => 8,
                    'color' => 'yellow',
                    'body' => 'Key claim. Needs a citation to the downscaling benchmark literature.',
                    'status' => 'open',
                ]
            );
        }

        if ($figure !== null) {
            DocumentAnnotation::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'project_file_id' => $figure->id,
                    'start_line' => 1,
                    'kind' => 'note',
                ],
                [
                    'user_id' => $coauthor->id,
                    'end_line' => 14,
                    'color' => 'blue',
                    'body' => 'Consider adding tensor shapes to the lift and projection blocks.',
                    'status' => 'open',
                ]
            );
        }

        if ($benchmark !== null) {
            DocumentAnnotation::query()->updateOrCreate(
                [
                    'project_id' => $project->id,
                    'project_file_id' => $benchmark->id,
                    'start_line' => 5,
                    'kind' => 'task',
                ],
                [
                    'user_id' => $researcher->id,
                    'end_line' => 9,
                    'color' => 'green',
                    'body' => 'Fill in the training-hour column from the latest sweep.',
                    'status' => 'resolved',
                ]
            );
        }
    }

    private function comment(CommentThread $thread, User $user, string $body, CarbonInterface $at): void
    {
        $comment = Comment::query()->firstOrCreate(
            ['thread_id' => $thread->id, 'user_id' => $user->id, 'body' => $body]
        );

        if ($comment->wasRecentlyCreated) {
            $this->backdate($comment, $at);
        }
    }

    private function reply(ProjectChatMessage $root, User $user, string $body, CarbonInterface $at): void
    {
        $reply = ProjectChatMessage::query()->firstOrCreate(
            [
                'project_id' => $root->project_id,
                'user_id' => $user->id,
                'body' => $body,
            ],
            ['parent_id' => $root->id]
        );

        if ($reply->wasRecentlyCreated) {
            $this->backdate($reply, $at);
        }
    }

    private function file(Project $project, string $path): ?ProjectFile
    {
        return ProjectFile::query()
            ->where('project_id', $project->id)
            ->where('path', $path)
            ->first();
    }

    private function backdate(Model $model, CarbonInterface $at): void
    {
        $model->timestamps = false;
        $model->forceFill(['created_at' => $at, 'updated_at' => $at])->save();
    }
}
