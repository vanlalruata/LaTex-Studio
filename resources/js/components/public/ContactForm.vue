<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { CheckCircle2 } from '@lucide/vue';
import { ref } from 'vue';
import { store } from '@/actions/App/Http/Controllers/PublicSite/ContactController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const submitted = ref(false);

const form = useForm({
    name: '',
    email: '',
    organization: '',
    role: '',
    category: 'general',
    subject: '',
    message: '',
    source_page: 'contact',
    website: '',
});

function submit(): void {
    form.submit(store(), {
        preserveScroll: true,
        onSuccess: () => {
            submitted.value = true;
            form.reset();
        },
    });
}
</script>

<template>
    <div
        class="rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft) sm:p-8"
    >
        <Alert
            v-if="submitted"
            role="status"
            class="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900"
        >
            <CheckCircle2 class="size-4 text-emerald-700" aria-hidden="true" />
            <AlertTitle>Enquiry received</AlertTitle>
            <AlertDescription class="text-emerald-800">
                Thank you. Your message has been recorded for our team to
                review.
            </AlertDescription>
        </Alert>

        <form class="space-y-5" @submit.prevent="submit">
            <div class="hidden" aria-hidden="true">
                <label for="contact-website">Website</label>
                <input
                    id="contact-website"
                    v-model="form.website"
                    type="text"
                    tabindex="-1"
                    autocomplete="off"
                />
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        for="contact-name"
                        class="block text-sm font-medium text-ink"
                    >
                        Full name <span class="text-red-600">*</span>
                    </label>
                    <input
                        id="contact-name"
                        v-model="form.name"
                        type="text"
                        required
                        maxlength="120"
                        :aria-invalid="Boolean(form.errors.name)"
                        aria-describedby="contact-name-error"
                        class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                    />
                    <p
                        v-if="form.errors.name"
                        id="contact-name-error"
                        class="mt-1 text-xs text-red-600"
                    >
                        {{ form.errors.name }}
                    </p>
                </div>

                <div>
                    <label
                        for="contact-email"
                        class="block text-sm font-medium text-ink"
                    >
                        Email address <span class="text-red-600">*</span>
                    </label>
                    <input
                        id="contact-email"
                        v-model="form.email"
                        type="email"
                        required
                        maxlength="180"
                        :aria-invalid="Boolean(form.errors.email)"
                        aria-describedby="contact-email-error"
                        class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                    />
                    <p
                        v-if="form.errors.email"
                        id="contact-email-error"
                        class="mt-1 text-xs text-red-600"
                    >
                        {{ form.errors.email }}
                    </p>
                </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        for="contact-organization"
                        class="block text-sm font-medium text-ink"
                    >
                        Organization / Institution
                    </label>
                    <input
                        id="contact-organization"
                        v-model="form.organization"
                        type="text"
                        maxlength="160"
                        class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label
                        for="contact-role"
                        class="block text-sm font-medium text-ink"
                    >
                        Role
                    </label>
                    <input
                        id="contact-role"
                        v-model="form.role"
                        type="text"
                        maxlength="120"
                        placeholder="e.g. Researcher, Faculty, PhD Student"
                        class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                    />
                </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        for="contact-category"
                        class="block text-sm font-medium text-ink"
                    >
                        Category <span class="text-red-600">*</span>
                    </label>
                    <select
                        id="contact-category"
                        v-model="form.category"
                        required
                        class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                    >
                        <option value="general">General</option>
                        <option value="product_enquiry">Product enquiry</option>
                        <option value="institutional_deployment">
                            Institutional deployment
                        </option>
                        <option value="technical_support">
                            Technical support
                        </option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label
                        for="contact-subject"
                        class="block text-sm font-medium text-ink"
                    >
                        Subject <span class="text-red-600">*</span>
                    </label>
                    <input
                        id="contact-subject"
                        v-model="form.subject"
                        type="text"
                        required
                        maxlength="180"
                        :aria-invalid="Boolean(form.errors.subject)"
                        aria-describedby="contact-subject-error"
                        class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                    />
                    <p
                        v-if="form.errors.subject"
                        id="contact-subject-error"
                        class="mt-1 text-xs text-red-600"
                    >
                        {{ form.errors.subject }}
                    </p>
                </div>
            </div>

            <div>
                <label
                    for="contact-message"
                    class="block text-sm font-medium text-ink"
                >
                    Message <span class="text-red-600">*</span>
                </label>
                <textarea
                    id="contact-message"
                    v-model="form.message"
                    rows="5"
                    required
                    minlength="10"
                    maxlength="4000"
                    :aria-invalid="Boolean(form.errors.message)"
                    aria-describedby="contact-message-error"
                    class="mt-1.5 w-full rounded-lg border border-academic-border bg-canvas px-3.5 py-2.5 text-sm text-ink focus:border-academic-primary focus:outline-none"
                />
                <p
                    v-if="form.errors.message"
                    id="contact-message-error"
                    class="mt-1 text-xs text-red-600"
                >
                    {{ form.errors.message }}
                </p>
            </div>

            <button
                type="submit"
                :disabled="form.processing"
                class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary disabled:opacity-60"
            >
                {{ form.processing ? 'Sending...' : 'Send enquiry' }}
            </button>
        </form>
    </div>
</template>
