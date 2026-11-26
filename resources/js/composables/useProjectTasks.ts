import { ref } from 'vue';
import { apiGet, apiSend } from '@/lib/http';
import tasksRoutes from '@/routes/projects/tasks';
import milestonesRoutes from '@/routes/projects/milestones';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
    public_id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_at: string | null;
    completed_at: string | null;
    milestone_public_id: string | null;
    milestone_title: string | null;
    assignee_name: string | null;
    is_overdue: boolean;
    created_at: string | null;
}

export interface MilestoneItem {
    public_id: string;
    title: string;
    description: string | null;
    status: 'planned' | 'active' | 'completed';
    due_at: string | null;
    completed_at: string | null;
    tasks_count: number;
}

export function useProjectTasks(projectPublicId: string) {
    const tasks = ref<TaskItem[]>([]);
    const milestones = ref<MilestoneItem[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function load(): Promise<void> {
        isLoading.value = true;
        const result = await apiGet<{
            tasks: TaskItem[];
            milestones: MilestoneItem[];
        }>(tasksRoutes.index(projectPublicId).url);
        isLoading.value = false;

        if (!result.ok || !result.data) {
            error.value = result.message;

            return;
        }

        tasks.value = result.data.tasks;
        milestones.value = result.data.milestones;
        error.value = null;
    }

    async function createTask(payload: {
        title: string;
        priority?: TaskPriority;
        milestoneId?: string | null;
    }): Promise<boolean> {
        const result = await apiSend<{ task: TaskItem }>(
            tasksRoutes.store(projectPublicId).url,
            'POST',
            {
                title: payload.title,
                priority: payload.priority ?? 'medium',
                milestone_id: payload.milestoneId ?? null,
            },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        tasks.value = [result.data.task, ...tasks.value];
        await refreshMilestoneCounts();

        return true;
    }

    async function updateTask(
        taskId: string,
        patch: Partial<{
            status: TaskStatus;
            priority: TaskPriority;
            title: string;
        }>,
    ): Promise<boolean> {
        const result = await apiSend<{ task: TaskItem }>(
            tasksRoutes.update({
                project: projectPublicId,
                task: taskId,
            }).url,
            'PATCH',
            patch,
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        const updated = result.data.task;
        tasks.value = tasks.value.map((task) =>
            task.public_id === updated.public_id ? updated : task,
        );
        await refreshMilestoneCounts();

        return true;
    }

    async function deleteTask(taskId: string): Promise<void> {
        const result = await apiSend<{ deleted: boolean }>(
            tasksRoutes.destroy({
                project: projectPublicId,
                task: taskId,
            }).url,
            'DELETE',
        );

        if (result.ok) {
            tasks.value = tasks.value.filter(
                (task) => task.public_id !== taskId,
            );
        }
    }

    async function createMilestone(title: string): Promise<boolean> {
        const result = await apiSend<{ milestone: MilestoneItem }>(
            milestonesRoutes.store(projectPublicId).url,
            'POST',
            { title, status: 'planned' },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        milestones.value = [...milestones.value, result.data.milestone];

        return true;
    }

    async function refreshMilestoneCounts(): Promise<void> {
        const result = await apiGet<{
            tasks: TaskItem[];
            milestones: MilestoneItem[];
        }>(tasksRoutes.index(projectPublicId).url);

        if (result.ok && result.data) {
            milestones.value = result.data.milestones;
        }
    }

    return {
        tasks,
        milestones,
        isLoading,
        error,
        load,
        createTask,
        updateTask,
        deleteTask,
        createMilestone,
    };
}