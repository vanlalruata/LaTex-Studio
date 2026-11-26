<script setup lang="ts">
import { MessageCircle, RefreshCw, Reply, Send, Users, X } from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import projectsRoutes from '@/routes/projects';

interface ChatUser {
    id: number | null;
    name: string;
}

interface ChatMessageItem {
    public_id: string;
    body: string;
    parent_public_id: string | null;
    user: ChatUser;
    created_at: string | null;
}

interface OnlineUser {
    id: number;
    name: string;
}

const props = defineProps<{
    projectPublicId: string;
}>();

const messages = ref<ChatMessageItem[]>([]);
const onlineUsers = ref<OnlineUser[]>([]);
const loading = ref(false);
const sending = ref(false);
const draft = ref('');
const replyingTo = ref<ChatMessageItem | null>(null);
let pollTimer: number | null = null;

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

const rootMessages = computed(() =>
    messages.value.filter((m) => m.parent_public_id === null),
);

function repliesFor(parentPublicId: string): ChatMessageItem[] {
    return messages.value.filter((m) => m.parent_public_id === parentPublicId);
}

async function fetchMessages(silent = false): Promise<void> {
    if (!silent) {
        loading.value = true;
    }
    try {
        const res = await fetch(
            projectsRoutes.chat.index(props.projectPublicId).url,
            {
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
            },
        );
        if (!res.ok) {
            return;
        }
        const data = (await res.json()) as {
            messages: ChatMessageItem[];
            onlineUsers: OnlineUser[];
        };
        messages.value = data.messages;
        onlineUsers.value = data.onlineUsers;
    } finally {
        loading.value = false;
    }
}

async function sendMessage(): Promise<void> {
    const body = draft.value.trim();
    if (!body || sending.value) {
        return;
    }

    sending.value = true;
    try {
        const res = await fetch(
            projectsRoutes.chat.store(props.projectPublicId).url,
            {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    body,
                    parent_public_id: replyingTo.value?.public_id ?? null,
                }),
            },
        );
        if (!res.ok) {
            toast.error('Unable to send chat message.');
            return;
        }
        const data = (await res.json()) as { message: ChatMessageItem };
        messages.value.push(data.message);
        draft.value = '';
        replyingTo.value = null;
    } finally {
        sending.value = false;
    }
}

function formatTime(iso: string | null): string {
    if (!iso) {
        return '';
    }
    try {
        return new Date(iso).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '';
    }
}

onMounted(() => {
    void fetchMessages();
    pollTimer = window.setInterval(() => {
        void fetchMessages(true);
    }, 8000);
});

onBeforeUnmount(() => {
    if (pollTimer !== null) {
        window.clearInterval(pollTimer);
    }
});
</script>

<template>
    <div class="flex h-full flex-col bg-white">
        <div
            class="flex items-center justify-between border-b border-slate-200 px-3 py-2"
        >
            <div class="flex items-center gap-1.5">
                <Users class="size-3.5 text-emerald-600" />
                <span class="text-xs font-medium text-slate-700">
                    {{ onlineUsers.length }} online
                </span>
            </div>
            <button
                type="button"
                class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                title="Refresh chat"
                @click="fetchMessages()"
            >
                <RefreshCw
                    class="size-3.5"
                    :class="{ 'animate-spin': loading }"
                />
            </button>
        </div>

        <div
            v-if="onlineUsers.length > 0"
            class="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/70 px-3 py-1.5"
        >
            <span
                v-for="u in onlineUsers"
                :key="u.id"
                class="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800"
            >
                <span class="size-1.5 rounded-full bg-emerald-500" />
                {{ u.name }}
            </span>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto p-3">
            <div
                v-if="rootMessages.length === 0"
                class="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400"
            >
                <MessageCircle class="mb-2 size-6 opacity-50" />
                <p>No chat messages yet.</p>
                <p class="mt-0.5 text-[11px]">
                    Start a conversation with your co-authors.
                </p>
            </div>

            <div
                v-for="msg in rootMessages"
                :key="msg.public_id"
                class="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"
            >
                <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-semibold text-slate-800">
                        {{ msg.user.name }}
                    </span>
                    <span class="text-[10px] text-slate-400">
                        {{ formatTime(msg.created_at) }}
                    </span>
                </div>
                <p
                    class="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-slate-700"
                >
                    {{ msg.body }}
                </p>
                <div class="mt-1.5 flex justify-end">
                    <button
                        type="button"
                        class="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                        @click="replyingTo = msg"
                    >
                        <Reply class="size-3" />
                        Reply
                    </button>
                </div>

                <div
                    v-if="repliesFor(msg.public_id).length > 0"
                    class="mt-2 space-y-1.5 border-l-2 border-indigo-200 pl-2.5"
                >
                    <div
                        v-for="reply in repliesFor(msg.public_id)"
                        :key="reply.public_id"
                        class="rounded bg-white p-2 text-xs shadow-2xs"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-semibold text-slate-800">
                                {{ reply.user.name }}
                            </span>
                            <span class="text-[10px] text-slate-400">
                                {{ formatTime(reply.created_at) }}
                            </span>
                        </div>
                        <p class="mt-0.5 whitespace-pre-wrap text-slate-700">
                            {{ reply.body }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <form
            class="border-t border-slate-200 bg-slate-50/60 p-2.5"
            @submit.prevent="sendMessage"
        >
            <div
                v-if="replyingTo"
                class="mb-2 flex items-center justify-between rounded bg-indigo-50 px-2 py-1 text-[11px] text-indigo-800"
            >
                <span class="truncate">
                    Replying to <strong>{{ replyingTo.user.name }}</strong>
                </span>
                <button
                    type="button"
                    class="rounded p-0.5 hover:bg-indigo-100"
                    @click="replyingTo = null"
                >
                    <X class="size-3" />
                </button>
            </div>

            <div class="flex gap-1.5">
                <input
                    v-model="draft"
                    type="text"
                    placeholder="Message collaborators..."
                    maxlength="2000"
                    class="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none"
                />
                <button
                    type="submit"
                    :disabled="sending || !draft.trim()"
                    class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    title="Send message"
                >
                    <Send class="size-3.5" />
                </button>
            </div>
        </form>
    </div>
</template>
