<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { KeyRound, ShieldCheck, Trash2 } from '@lucide/vue';
import { watch } from 'vue';
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import aiCredentialsRoutes from '@/routes/ai-credentials';

interface CredentialItem {
    public_id: string;
    provider: string;
    provider_label: string;
    label: string;
    model: string;
    base_url: string | null;
    key_last_four: string;
    is_default: boolean;
}

interface ProviderOption {
    value: string;
    label: string;
    default_model: string;
}

const props = defineProps<{
    credentials: CredentialItem[];
    providers: ProviderOption[];
}>();

const form = useForm({
    provider: 'gemini',
    label: 'Personal Gemini Key',
    model: 'gemini-2.5-flash',
    base_url: '',
    api_key: '',
    is_default: true,
});

watch(
    () => form.provider,
    (newProvider) => {
        const match = props.providers.find((p) => p.value === newProvider);
        if (match) {
            form.model = match.default_model;
            form.label = `Personal ${match.label} Key`;
        }
    },
);

function submit(): void {
    form.post(aiCredentialsRoutes.store().url, {
        preserveScroll: true,
        onSuccess: () => {
            form.reset('api_key', 'base_url');
        },
    });
}

function removeCredential(publicId: string): void {
    router.delete(aiCredentialsRoutes.destroy(publicId).url, {
        preserveScroll: true,
    });
}
</script>

<template>
    <div class="space-y-6">
        <Head title="AI API Keys" />

        <Heading
            variant="small"
            title="Personal AI API Keys"
            description="Add your own Gemini, OpenAI, Anthropic, or OpenAI-compatible API key. Keys are encrypted at rest and accessible only by your account."
        />

        <div class="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900">
            <ShieldCheck class="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <p>
                Your API keys are strictly private to your user account—project collaborators and administrators cannot view or use your keys.
            </p>
        </div>

        <form class="space-y-4 rounded-xl border border-slate-200 bg-white p-5" @submit.prevent="submit">
            <div class="grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-xs font-medium text-slate-700">Provider</label>
                    <select
                        v-model="form.provider"
                        class="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    >
                        <option v-for="p in providers" :key="p.value" :value="p.value">
                            {{ p.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-medium text-slate-700">Model</label>
                    <input
                        v-model="form.model"
                        type="text"
                        required
                        class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-xs font-medium text-slate-700">Label</label>
                    <input
                        v-model="form.label"
                        type="text"
                        required
                        class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                </div>

                <div v-if="form.provider === 'openai_compatible'">
                    <label class="block text-xs font-medium text-slate-700">Base URL</label>
                    <input
                        v-model="form.base_url"
                        type="url"
                        placeholder="https://api.example.com/v1"
                        class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            <div>
                <label class="block text-xs font-medium text-slate-700">API Key</label>
                <input
                    v-model="form.api_key"
                    type="password"
                    required
                    autocomplete="off"
                    placeholder="Paste your API key here..."
                    class="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500"
                />
                <p v-if="form.errors.api_key" class="mt-1 text-xs text-rose-600">
                    {{ form.errors.api_key }}
                </p>
            </div>

            <label class="flex items-center gap-2 text-xs text-slate-700">
                <input v-model="form.is_default" type="checkbox" class="rounded border-slate-300" />
                <span>Set as my default AI key</span>
            </label>

            <Button type="submit" :disabled="form.processing">
                {{ form.processing ? 'Saving...' : 'Save Encrypted Key' }}
            </Button>
        </form>

        <div class="space-y-3">
            <h3 class="text-sm font-semibold text-slate-900">Saved Personal Keys</h3>
            <p v-if="credentials.length === 0" class="text-xs text-slate-500">
                No personal AI keys configured yet.
            </p>

            <div
                v-for="cred in credentials"
                :key="cred.public_id"
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3.5 text-sm"
            >
                <div class="flex items-center gap-3">
                    <div class="rounded-md bg-indigo-50 p-2 text-indigo-600">
                        <KeyRound class="size-4" />
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-slate-900">{{ cred.label }}</span>
                            <span
                                v-if="cred.is_default"
                                class="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700"
                            >
                                Default
                            </span>
                        </div>
                        <p class="font-mono text-xs text-slate-500">
                            {{ cred.provider_label }} · {{ cred.model }} · ••••{{ cred.key_last_four }}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    class="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete API key"
                    @click="removeCredential(cred.public_id)"
                >
                    <Trash2 class="size-4" />
                </button>
            </div>
        </div>
    </div>
</template>
