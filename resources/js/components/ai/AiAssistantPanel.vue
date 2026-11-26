<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { KeyRound, Loader2, Send, Sparkles } from '@lucide/vue';
import { ref } from 'vue';
import { edit as editAiCredentials } from '@/routes/ai-credentials';

export interface AiCredentialSummary {
    public_id: string;
    provider: string;
    label: string;
    model: string;
    is_default: boolean;
}

export interface AiActionItem {
    public_id: string;
    kind: string;
    prompt: string;
    response_text: string;
    status: string;
}

const props = defineProps<{
    credentials: AiCredentialSummary[];
    actions: AiActionItem[];
    isAsking: boolean;
    errorMessage: string | null;
}>();

const emit = defineEmits<{
    ask: [payload: { credentialId: string; kind: 'chat' | 'compile_fix' | 'paper_review'; prompt: string }];
}>();

const selectedCredentialId = ref(
    props.credentials.find((c) => c.is_default)?.public_id ?? props.credentials[0]?.public_id ?? '',
);
const kind = ref<'chat' | 'compile_fix' | 'paper_review'>('chat');
const prompt = ref('');

function submit(): void {
    const text = prompt.value.trim();
    if (!text || props.isAsking) {
        return;
    }

    const credId =
        selectedCredentialId.value ||
        props.credentials.find((c) => c.is_default)?.public_id ||
        props.credentials[0]?.public_id ||
        '';

    emit('ask', {
        credentialId: credId,
        kind: kind.value,
        prompt: text,
    });
    prompt.value = '';
}
</script>

<template>
    <div class="flex h-full flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <span class="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <Sparkles class="size-3.5 text-indigo-600" />
                AI Assistant
            </span>
            <Link
                :href="editAiCredentials().url"
                class="text-[11px] font-medium text-indigo-600 hover:underline"
            >
                My API Keys
            </Link>
        </div>

        <div v-if="credentials.length === 0" class="m-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <div class="flex items-center gap-1.5 font-semibold">
                <KeyRound class="size-3.5" />
                <span>Personal API Key Required</span>
            </div>
            <p class="mt-1 leading-relaxed">
                Paste your own Gemini, OpenAI, or Anthropic API key in Settings to use the AI Assistant.
            </p>
            <Link
                :href="editAiCredentials().url"
                class="mt-2 inline-block rounded bg-amber-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-amber-700"
            >
                Configure AI Key
            </Link>
        </div>

        <template v-else>
            <div class="space-y-2 border-b border-slate-100 p-2">
                <select
                    v-model="selectedCredentialId"
                    class="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-500"
                >
                    <option v-for="c in credentials" :key="c.public_id" :value="c.public_id">
                        {{ c.label }} ({{ c.model }})
                    </option>
                </select>

                <div class="flex gap-1">
                    <button
                        type="button"
                        class="flex-1 rounded px-1.5 py-1 text-[10px] font-medium"
                        :class="kind === 'chat' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'"
                        @click="kind = 'chat'"
                    >
                        Chat
                    </button>
                    <button
                        type="button"
                        class="flex-1 rounded px-1.5 py-1 text-[10px] font-medium"
                        :class="kind === 'compile_fix' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'"
                        @click="kind = 'compile_fix'"
                    >
                        Fix Build
                    </button>
                    <button
                        type="button"
                        class="flex-1 rounded px-1.5 py-1 text-[10px] font-medium"
                        :class="kind === 'paper_review' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'"
                        @click="kind = 'paper_review'"
                    >
                        Review
                    </button>
                </div>
            </div>

            <div class="flex-1 space-y-2.5 overflow-y-auto p-2 text-xs">
                <p v-if="errorMessage" class="rounded bg-rose-50 p-2 text-rose-700">
                    {{ errorMessage }}
                </p>

                <div v-for="action in actions" :key="action.public_id" class="space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5">
                    <p class="font-medium text-slate-900">{{ action.prompt }}</p>
                    <p class="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-700">
                        {{ action.response_text }}
                    </p>
                </div>
            </div>

            <form class="border-t border-slate-100 p-2" @submit.prevent="submit">
                <div class="flex gap-1.5">
                    <input
                        v-model="prompt"
                        type="text"
                        placeholder="Ask AI about this manuscript..."
                        class="min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        :disabled="isAsking"
                        class="rounded-md bg-indigo-600 px-2.5 py-1.5 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Loader2 v-if="isAsking" class="size-3.5 animate-spin" />
                        <Send v-else class="size-3.5" />
                    </button>
                </div>
            </form>
        </template>
    </div>
</template>
