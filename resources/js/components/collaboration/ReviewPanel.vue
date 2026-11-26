<script setup lang="ts">
import { Check, CheckCircle2, Highlighter, MessageSquare, Send, X } from '@lucide/vue';
import { ref } from 'vue';
import type { AnnotationItem } from '@/composables/useProjectAnnotations';

export interface CommentThreadItem {
    public_id: string;
    file_path: string;
    start_line: number;
    end_line: number;
    status: string;
    author_name: string;
    comments: Array<{ id: number; author_name: string; body: string }>;
}

export interface SuggestionItem {
    public_id: string;
    file_path: string;
    title: string;
    original_excerpt: string | null;
    proposed_content: string;
    source: string;
    status: string;
    proposer_name: string;
}

defineProps<{
    threads: CommentThreadItem[];
    suggestions: SuggestionItem[];
    annotations: AnnotationItem[];
    canComment: boolean;
    canEdit: boolean;
}>();

const emit = defineEmits<{
    createThread: [body: string];
    resolveThread: [publicId: string];
    acceptSuggestion: [publicId: string];
    rejectSuggestion: [publicId: string];
    createAnnotation: [body: string];
    resolveAnnotation: [publicId: string];
    removeAnnotation: [publicId: string];
    jumpToLine: [line: number];
}>();

const activeTab = ref<'comments' | 'suggestions' | 'annotations'>('comments');
const newCommentBody = ref('');
const newAnnotationBody = ref('');

function submitComment(): void {
    const body = newCommentBody.value.trim();
    if (!body) {
        return;
    }
    emit('createThread', body);
    newCommentBody.value = '';
}

function submitAnnotation(): void {
    const body = newAnnotationBody.value.trim();
    if (!body) {
        return;
    }
    emit('createAnnotation', body);
    newAnnotationBody.value = '';
}
</script>

<template>
    <div class="flex h-full flex-col">
        <div class="flex border-b border-slate-100">
            <button
                type="button"
                class="flex-1 py-2 text-xs font-semibold transition"
                :class="activeTab === 'comments' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500'"
                @click="activeTab = 'comments'"
            >
                Comments ({{ threads.length }})
            </button>
            <button
                type="button"
                class="flex-1 py-2 text-xs font-semibold transition"
                :class="activeTab === 'suggestions' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500'"
                @click="activeTab = 'suggestions'"
            >
                Changes ({{ suggestions.filter((s) => s.status === 'pending').length }})
            </button>
            <button
                type="button"
                class="flex-1 py-2 text-xs font-semibold transition"
                :class="activeTab === 'annotations' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-slate-500'"
                @click="activeTab = 'annotations'"
            >
                Notes ({{ annotations.filter((a) => a.status === 'open').length }})
            </button>
        </div>

        <div v-if="activeTab === 'comments'" class="flex flex-1 flex-col overflow-hidden">
            <form v-if="canComment" class="border-b border-slate-100 p-2" @submit.prevent="submitComment">
                <div class="flex gap-1.5">
                    <input
                        v-model="newCommentBody"
                        type="text"
                        placeholder="Add comment at current line..."
                        class="min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-white hover:bg-indigo-700"
                        title="Post comment"
                    >
                        <Send class="size-3.5" />
                    </button>
                </div>
            </form>

            <div class="flex-1 space-y-2 overflow-y-auto p-2">
                <div v-if="threads.length === 0" class="py-8 text-center text-xs text-slate-400">
                    <MessageSquare class="mx-auto mb-2 size-6 text-slate-300" />
                    <p>No review comments yet.</p>
                </div>

                <div
                    v-for="thread in threads"
                    :key="thread.public_id"
                    class="rounded-lg border border-slate-200 bg-white p-2.5 text-xs"
                    :class="thread.status === 'resolved' ? 'opacity-60' : ''"
                >
                    <div class="flex items-center justify-between">
                        <button
                            type="button"
                            class="font-mono text-[11px] font-medium text-indigo-600 hover:underline"
                            @click="emit('jumpToLine', thread.start_line)"
                        >
                            {{ thread.file_path }}:{{ thread.start_line }}
                        </button>
                        <button
                            v-if="canComment"
                            type="button"
                            class="rounded p-0.5 text-slate-400 hover:text-emerald-600"
                            :title="thread.status === 'resolved' ? 'Reopen' : 'Resolve'"
                            @click="emit('resolveThread', thread.public_id)"
                        >
                            <CheckCircle2 class="size-3.5" />
                        </button>
                    </div>
                    <div v-for="c in thread.comments" :key="c.id" class="mt-1.5 text-slate-700">
                        <span class="font-semibold">{{ c.author_name }}:</span> {{ c.body }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="activeTab === 'suggestions'" class="flex-1 space-y-2 overflow-y-auto p-2">
            <p v-if="suggestions.length === 0" class="py-8 text-center text-xs text-slate-400">
                No tracked changes or AI diff proposals yet.
            </p>

            <div
                v-for="s in suggestions"
                :key="s.public_id"
                class="rounded-lg border border-slate-200 bg-white p-2.5 text-xs"
            >
                <div class="flex items-center justify-between gap-2">
                    <span class="font-semibold text-slate-900">{{ s.title }}</span>
                    <span
                        class="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase"
                        :class="
                            s.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-700'
                                : s.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'bg-amber-50 text-amber-700'
                        "
                    >
                        {{ s.status }}
                    </span>
                </div>
                <p class="mt-0.5 text-[11px] text-slate-500">
                    {{ s.file_path }} · {{ s.source === 'ai' ? 'AI Proposal' : s.proposer_name }}
                </p>
                <pre class="mt-1.5 max-h-24 overflow-auto rounded bg-slate-50 p-1.5 font-mono text-[10px] text-emerald-800">{{ s.proposed_content }}</pre>

                <div v-if="canEdit && s.status === 'pending'" class="mt-2 flex gap-1.5">
                    <button
                        type="button"
                        class="inline-flex flex-1 items-center justify-center gap-1 rounded bg-emerald-600 py-1 text-[11px] font-medium text-white hover:bg-emerald-700"
                        @click="emit('acceptSuggestion', s.public_id)"
                    >
                        <Check class="size-3" /> Accept
                    </button>
                    <button
                        type="button"
                        class="inline-flex flex-1 items-center justify-center gap-1 rounded border border-slate-200 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                        @click="emit('rejectSuggestion', s.public_id)"
                    >
                        <X class="size-3" /> Reject
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-1 flex-col overflow-hidden">
            <form v-if="canComment" class="border-b border-slate-100 p-2" @submit.prevent="submitAnnotation">
                <div class="flex gap-1.5">
                    <input
                        v-model="newAnnotationBody"
                        type="text"
                        placeholder="Pin a note at the current line..."
                        class="min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        class="rounded-md bg-slate-800 px-2.5 py-1.5 text-white hover:bg-slate-900"
                        title="Add inline annotation"
                    >
                        <Highlighter class="size-3.5" />
                    </button>
                </div>
            </form>

            <div class="flex-1 space-y-2 overflow-y-auto p-2">
                <p v-if="annotations.length === 0" class="py-8 text-center text-xs text-slate-400">
                    No inline annotations yet.
                </p>

                <div
                    v-for="annotation in annotations"
                    :key="annotation.public_id"
                    class="rounded-lg border border-slate-200 bg-white p-2.5 text-xs"
                    :class="annotation.status === 'resolved' ? 'opacity-60' : ''"
                >
                    <div class="flex items-center justify-between gap-2">
                        <button
                            type="button"
                            class="font-mono text-[11px] font-medium text-indigo-600 hover:underline"
                            @click="emit('jumpToLine', annotation.start_line)"
                        >
                            {{ annotation.file_path ?? 'source' }}:{{ annotation.start_line }}
                        </button>
                        <div class="flex items-center gap-1">
                            <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-600">
                                {{ annotation.kind }}
                            </span>
                            <button
                                v-if="canComment"
                                type="button"
                                class="rounded p-0.5 text-slate-400 hover:text-emerald-600"
                                :title="annotation.status === 'resolved' ? 'Reopen note' : 'Resolve note'"
                                @click="emit('resolveAnnotation', annotation.public_id)"
                            >
                                <CheckCircle2 class="size-3.5" />
                            </button>
                            <button
                                v-if="canEdit"
                                type="button"
                                class="rounded p-0.5 text-slate-400 hover:text-rose-600"
                                title="Delete note"
                                @click="emit('removeAnnotation', annotation.public_id)"
                            >
                                <X class="size-3.5" />
                            </button>
                        </div>
                    </div>
                    <p v-if="annotation.body" class="mt-1.5 text-slate-700">
                        {{ annotation.body }}
                    </p>
                    <p class="mt-1 text-[10px] text-slate-500">{{ annotation.author_name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
