<?php

namespace Database\Seeders;

use App\Models\AuditEvent;
use App\Models\Project;
use App\Models\UsageRecord;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $project = Project::query()->where('title', ProjectSeeder::DEMO_PROJECT_TITLE)->first();
        $researcher = User::query()->where('email', 'researcher@latexstudio.com')->first();
        $coauthor = User::query()->where('email', 'coauthor@latexstudio.com')->first();

        if ($project === null || $researcher === null || $coauthor === null) {
            return;
        }

        $this->seedAuditEvents($project, $researcher);
        $this->seedUsageRecords($project, $researcher, $coauthor);
    }

    private function seedAuditEvents(Project $project, User $actor): void
    {
        $events = [
            [
                'action' => 'project.created',
                'subject_type' => Project::class,
                'subject_id' => $project->id,
                'metadata' => ['seed' => true, 'title' => $project->title],
                'at' => now()->subDays(21),
            ],
            [
                'action' => 'member.invited',
                'subject_type' => User::class,
                'subject_id' => null,
                'metadata' => ['seed' => true, 'email' => 'reviewer@latexstudio.com', 'role' => 'reviewer'],
                'at' => now()->subDays(20),
            ],
            [
                'action' => 'file.updated',
                'subject_type' => 'project_file',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'path' => 'main.tex', 'version' => 1],
                'at' => now()->subDays(14),
            ],
            [
                'action' => 'compilation.requested',
                'subject_type' => 'compilation',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'engine' => 'pdflatex', 'profile' => 'research'],
                'at' => now()->subDays(12),
            ],
            [
                'action' => 'compilation.published',
                'subject_type' => 'compilation',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'duration_ms' => 4821, 'pages' => 12],
                'at' => now()->subDays(12)->addSeconds(5),
            ],
            [
                'action' => 'comment.resolved',
                'subject_type' => 'comment_thread',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'file' => 'figures/architecture.tex'],
                'at' => now()->subDays(6),
            ],
            [
                'action' => 'suggestion.accepted',
                'subject_type' => 'change_suggestion',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'title' => 'Tighten the contributions list'],
                'at' => now()->subDays(4),
            ],
            [
                'action' => 'ai.action.created',
                'subject_type' => 'ai_action',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'kind' => 'paper_review', 'provider' => 'openai'],
                'at' => now()->subDays(2),
            ],
            [
                'action' => 'integration.connected',
                'subject_type' => 'project_integration',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'provider' => 'zotero', 'collection' => 'Climate ML'],
                'at' => now()->subDay(),
            ],
            [
                'action' => 'task.completed',
                'subject_type' => 'project_task',
                'subject_id' => null,
                'metadata' => ['seed' => true, 'title' => 'Collect ERA5 predictor fields'],
                'at' => now()->subDays(21)->addHours(3),
            ],
        ];

        foreach ($events as $event) {
            $record = AuditEvent::query()->firstOrCreate(
                [
                    'project_id' => $project->id,
                    'action' => $event['action'],
                    'subject_type' => $event['subject_type'],
                ],
                [
                    'user_id' => $actor->id,
                    'subject_id' => $event['subject_id'],
                    'metadata' => $event['metadata'],
                    'ip_address' => '203.0.113.'.(10 + random_int(0, 40)),
                ]
            );

            if ($record->wasRecentlyCreated) {
                $this->backdate($record, $event['at']);
            }
        }
    }

    private function seedUsageRecords(Project $project, User $researcher, User $coauthor): void
    {
        $alreadySeeded = UsageRecord::query()
            ->where('project_id', $project->id)
            ->whereJsonContains('metadata->seed', true)
            ->exists();

        if ($alreadySeeded) {
            return;
        }

        foreach ([$researcher, $coauthor] as $index => $user) {
            for ($daysAgo = 9; $daysAgo >= 0; $daysAgo--) {
                $at = now()->subDays($daysAgo)->setTime(9 + ($index * 2), 15);

                $records = [
                    [
                        'metric' => 'compile_seconds',
                        'quantity' => 240 + ($daysAgo * 17) + ($index * 45),
                        'metadata' => ['seed' => true, 'date' => $at->toDateString()],
                    ],
                    [
                        'metric' => 'ai_tokens',
                        'quantity' => 1200 + ($daysAgo * 210) + ($index * 380),
                        'metadata' => ['seed' => true, 'date' => $at->toDateString()],
                    ],
                ];

                if ($daysAgo % 3 === 0) {
                    $records[] = [
                        'metric' => 'pdf_downloads',
                        'quantity' => 1 + ($index + 1) * 2,
                        'metadata' => ['seed' => true, 'date' => $at->toDateString()],
                    ];
                }

                foreach ($records as $record) {
                    $usage = UsageRecord::query()->create([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                        'metric' => $record['metric'],
                        'quantity' => $record['quantity'],
                        'metadata' => $record['metadata'],
                    ]);

                    $this->backdate($usage, $at);
                }
            }
        }
    }

    private function backdate(Model $model, CarbonInterface $at): void
    {
        $model->timestamps = false;
        $model->forceFill(['created_at' => $at, 'updated_at' => $at])->save();
    }
}
