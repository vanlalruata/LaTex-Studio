<script setup lang="ts">
import type { PresenceUser } from '@/composables/useWorkspacePresence';

defineProps<{
    users: PresenceUser[];
    currentFileId?: string | null;
}>();

const emit = defineEmits<{
    jump: [user: PresenceUser];
}>();

const palette: Record<string, string> = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    violet: 'bg-violet-500',
};

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function describe(user: PresenceUser): string {
    if (!user.cursor) {
        return user.name;
    }

    return `${user.name} · ${user.cursor.file_path}:${user.cursor.line}`;
}
</script>

<template>
    <div class="flex items-center gap-1" title="Collaborators online">
        <button
            v-for="user in users"
            :key="user.id"
            type="button"
            class="flex size-6 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white transition hover:scale-105"
            :class="[palette[user.color] ?? 'bg-slate-500', user.cursor ? '' : 'opacity-60']"
            :title="describe(user)"
            @click="user.cursor ? emit('jump', user) : undefined"
        >
            {{ initials(user.name) }}
        </button>
        <span
            v-if="users.length > 0"
            class="ml-0.5 text-[11px] font-medium text-slate-500"
        >
            {{ users.length }} online
        </span>
    </div>
</template>