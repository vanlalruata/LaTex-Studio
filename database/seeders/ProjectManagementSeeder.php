<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectIntegration;
use App\Models\ProjectMilestone;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectManagementSeeder extends Seeder
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

        if ($researcher === null || $coauthor === null || $reviewer === null) {
            return;
        }

        $literature = ProjectMilestone::query()->updateOrCreate(
            ['project_id' => $project->id, 'title' => 'Literature review'],
            [
                'description' => 'Survey neural operators, sparse training, and climate downscaling baselines.',
                'due_at' => now()->subDays(24),
                'status' => 'completed',
                'completed_at' => now()->subDays(20),
                'sort_order' => 1,
            ]
        );

        $implementation = ProjectMilestone::query()->updateOrCreate(
            ['project_id' => $project->id, 'title' => 'Method implementation'],
            [
                'description' => 'Implement the sparse Fourier operator and the physics residual, then lock the training configuration.',
                'due_at' => now()->addDays(10),
                'status' => 'active',
                'completed_at' => null,
                'sort_order' => 2,
            ]
        );

        $submission = ProjectMilestone::query()->updateOrCreate(
            ['project_id' => $project->id, 'title' => 'Camera-ready submission'],
            [
                'description' => 'Address reviewer comments, freeze artifacts, and submit the camera-ready package.',
                'due_at' => now()->addDays(45),
                'status' => 'planned',
                'completed_at' => null,
                'sort_order' => 3,
            ]
        );

        $tasks = [
            [
                'title' => 'Collect ERA5 predictor fields',
                'milestone' => $literature,
                'assigned_to' => $researcher,
                'created_by' => $researcher,
                'status' => 'done',
                'priority' => 'high',
                'due_at' => now()->subDays(22),
                'completed_at' => now()->subDays(21),
                'sort_order' => 1,
            ],
            [
                'title' => 'Annotate five regional target sets',
                'milestone' => $literature,
                'assigned_to' => $coauthor,
                'created_by' => $researcher,
                'status' => 'done',
                'priority' => 'medium',
                'due_at' => now()->subDays(18),
                'completed_at' => now()->subDays(19),
                'sort_order' => 2,
            ],
            [
                'title' => 'Implement group-lasso spectral pruning',
                'milestone' => $implementation,
                'assigned_to' => $researcher,
                'created_by' => $researcher,
                'status' => 'in_progress',
                'priority' => 'high',
                'due_at' => now()->addDays(3),
                'completed_at' => null,
                'sort_order' => 3,
            ],
            [
                'title' => 'Wire the physics residual into training',
                'milestone' => $implementation,
                'assigned_to' => $coauthor,
                'created_by' => $researcher,
                'status' => 'todo',
                'priority' => 'high',
                'due_at' => now()->addDays(6),
                'completed_at' => null,
                'sort_order' => 4,
            ],
            [
                'title' => 'Run the three-seed ablation sweep',
                'milestone' => $implementation,
                'assigned_to' => $coauthor,
                'created_by' => $researcher,
                'status' => 'blocked',
                'priority' => 'medium',
                'due_at' => now()->addDays(8),
                'completed_at' => null,
                'sort_order' => 5,
            ],
            [
                'title' => 'Verify appendix proof',
                'milestone' => $submission,
                'assigned_to' => $reviewer,
                'created_by' => $researcher,
                'status' => 'in_progress',
                'priority' => 'high',
                'due_at' => now()->addDays(14),
                'completed_at' => null,
                'sort_order' => 6,
            ],
            [
                'title' => 'Freeze build artifacts for the reported results',
                'milestone' => $submission,
                'assigned_to' => $researcher,
                'created_by' => $researcher,
                'status' => 'todo',
                'priority' => 'urgent',
                'due_at' => now()->addDays(30),
                'completed_at' => null,
                'sort_order' => 7,
            ],
            [
                'title' => 'Prepare the conference slide deck',
                'milestone' => $submission,
                'assigned_to' => $coauthor,
                'created_by' => $coauthor,
                'status' => 'todo',
                'priority' => 'low',
                'due_at' => now()->addDays(40),
                'completed_at' => null,
                'sort_order' => 8,
            ],
        ];

        foreach ($tasks as $task) {
            ProjectTask::query()->updateOrCreate(
                ['project_id' => $project->id, 'title' => $task['title']],
                [
                    'milestone_id' => $task['milestone']->id,
                    'assigned_to' => $task['assigned_to']->id,
                    'created_by' => $task['created_by']->id,
                    'description' => null,
                    'status' => $task['status'],
                    'priority' => $task['priority'],
                    'due_at' => $task['due_at'],
                    'completed_at' => $task['completed_at'],
                    'sort_order' => $task['sort_order'],
                ]
            );
        }

        $integrations = [
            [
                'provider' => 'github',
                'label' => 'GitHub',
                'status' => 'connected',
                'config' => [
                    'repository' => 'reaslab/climate-operators',
                    'branch' => 'main',
                    'sync_mode' => 'push_on_compile',
                ],
                'last_synced_at' => now()->subDay(),
                'connected_by' => $researcher->id,
            ],
            [
                'provider' => 'zotero',
                'label' => 'Zotero',
                'status' => 'connected',
                'config' => [
                    'library_id' => 'reaslab',
                    'collection' => 'Climate ML',
                    'auto_sync' => true,
                ],
                'last_synced_at' => now()->subHours(6),
                'connected_by' => $coauthor->id,
            ],
            [
                'provider' => 'slack',
                'label' => 'Slack',
                'status' => 'disconnected',
                'config' => [
                    'channel' => '#climate-paper',
                ],
                'last_synced_at' => null,
                'connected_by' => null,
            ],
        ];

        foreach ($integrations as $integration) {
            ProjectIntegration::query()->updateOrCreate(
                ['project_id' => $project->id, 'provider' => $integration['provider']],
                [
                    'label' => $integration['label'],
                    'status' => $integration['status'],
                    'config' => $integration['config'],
                    'last_synced_at' => $integration['last_synced_at'],
                    'connected_by' => $integration['connected_by'],
                ]
            );
        }
    }
}
