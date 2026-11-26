<script setup lang="ts">
import { CheckCircle2, Circle, ListChecks, Plus, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import type {
    MilestoneItem,
    TaskItem,
    TaskPriority,
} from '@/composables/useProjectTasks';

const props = defineProps<{
    tasks: TaskItem[];
    milestones: MilestoneItem[];
    canEdit: boolean;
    isLoading: boolean;
    error: string | null;
}>();

const emit = defineEmits<{
    createTask: [title: string, priority: TaskPriority];
    updateTask: [taskId: string, status: TaskItem['status']];
    deleteTask: [taskId: string];
    createMilestone: [title: string];
}>();

const newTaskTitle = ref('');
const newTaskPriority = ref<TaskPriority>('medium');
const newMilestoneTitle = ref('');

const priorityClasses: Record<TaskPriority, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-sky-50 text-sky-700',
    high: 'bg-amber-50 text-amber-700',
    urgent: 'bg-rose-50 text-rose-700',
};

function submitTask(): void {
    const title = newTaskTitle.value.trim();
    if (!title) {
        return;
    }

    emit('createTask', title, newTaskPriority.value);
    newTaskTitle.value = '';
}

function submitMilestone(): void {
    const title = newMilestoneTitle.value.trim();
    if (!title) {
        return;
    }

    emit('createMilestone', title);
    newMilestoneTitle.value = '';
}

function toggleTask(task: TaskItem): void {
    emit('updateTask', task.public_id, task.status === 'done' ? 'todo' : 'done');
}
</script>

<template>
    <div class="flex h-full flex-col bg-white">
        <div class="border-b border-slate-100 px-3 py-2">
            <span
                class="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase"
            >
                <ListChecks class="size-3.5 text-indigo-600" />
                Project tasks
            </span>
        </div>

        <div class="flex-1 overflow-y-auto p-2 text-xs">
            <p v-if="props.error" class="mb-2 rounded bg-rose-50 p-2 text-rose-700">
                {{ props.error }}
            </p>

            <form v-if="canEdit" class="mb-3 space-y-1.5" @submit.prevent="submitTask">
                <input
                    v-model="newTaskTitle"
                    type="text"
                    placeholder="Add a task..."
                    class="w-full rounded border border-slate-200 px-2 py-1.5 outline-none focus:border-indigo-500"
                />
                <div class="flex gap-1.5">
                    <select
                        v-model="newTaskPriority"
                        class="flex-1 rounded border border-slate-200 bg-white px-1.5 py-1"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <button
                        type="submit"
                        class="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 font-medium text-white hover:bg-indigo-700"
                    >
                        <Plus class="size-3.5" /> Add
                    </button>
                </div>
            </form>

            <p v-if="isLoading" class="py-4 text-center text-slate-400">Loading tasks…</p>
            <p
                v-else-if="tasks.length === 0"
                class="py-6 text-center text-slate-400"
            >
                No tasks yet. Break the manuscript work into trackable steps.
            </p>

            <div aria-label="Current tasks" class="space-y-1.5">
                <div
                    v-for="task in tasks"
                    :key="task.public_id"
                    class="group rounded-lg border border-slate-200 bg-white p-2"
                    :class="task.status === 'done' ? 'opacity-60' : ''"
                >
                    <div class="flex items-start gap-1.5">
                        <button
                            type="button"
                            class="mt-0.5 text-slate-400 hover:text-emerald-600 disabled:opacity-40"
                            :disabled="!canEdit"
                            :title="task.status === 'done' ? 'Reopen task' : 'Mark done'"
                            @click="toggleTask(task)"
                        >
                            <CheckCircle2
                                v-if="task.status === 'done'"
                                class="size-3.5 text-emerald-600"
                            />
                            <Circle v-else class="size-3.5" />
                        </button>
                        <div class="min-w-0 flex-1">
                            <p
                                class="truncate font-medium text-slate-800"
                                :class="task.status === 'done' ? 'line-through' : ''"
                            >
                                {{ task.title }}
                            </p>
                            <div class="mt-1 flex flex-wrap items-center gap-1">
                                <span
                                    class="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase"
                                    :class="priorityClasses[task.priority]"
                                >
                                    {{ task.priority }}
                                </span>
                                <span
                                    v-if="task.milestone_title"
                                    class="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700"
                                >
                                    {{ task.milestone_title }}
                                </span>
                                <span
                                    v-if="task.assignee_name"
                                    class="text-[10px] text-slate-500"
                                >
                                    {{ task.assignee_name }}
                                </span>
                                <span
                                    v-if="task.is_overdue"
                                    class="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700"
                                >
                                    overdue
                                </span>
                            </div>
                        </div>
                        <button
                            v-if="canEdit"
                            type="button"
                            class="hidden rounded p-0.5 text-slate-400 group-hover:block hover:text-rose-600"
                            title="Delete task"
                            @click="emit('deleteTask', task.public_id)"
                        >
                            <Trash2 class="size-3" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-4 border-t border-slate-100 pt-2">
                <p class="mb-1.5 font-semibold text-slate-700">Milestones</p>
                <div class="space-y-1">
                    <div
                        v-for="milestone in milestones"
                        :key="milestone.public_id"
                        class="flex items-center justify-between rounded border border-slate-100 bg-slate-50/60 px-2 py-1"
                    >
                        <span class="truncate text-slate-700">{{ milestone.title }}</span>
                        <span class="ml-2 shrink-0 text-[10px] text-slate-500">
                            {{ milestone.tasks_count }} tasks · {{ milestone.status }}
                        </span>
                    </div>
                    <p v-if="milestones.length === 0" class="text-[11px] text-slate-400">
                        No milestones defined.
                    </p>
                </div>

                <form
                    v-if="canEdit"
                    class="mt-1.5 flex gap-1"
                    @submit.prevent="submitMilestone"
                >
                    <input
                        v-model="newMilestoneTitle"
                        type="text"
                        placeholder="New milestone..."
                        class="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1"
                    />
                    <button
                        type="submit"
                        class="rounded bg-slate-800 px-2 py-1 font-medium text-white hover:bg-slate-900"
                    >
                        <Plus class="size-3.5" />
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>