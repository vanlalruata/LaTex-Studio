<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { update } from '@/actions/App/Http/Controllers/Admin/ContactEnquiryController';

interface EnquiryRow {
    id: number;
    name: string;
    email: string;
    organization: string | null;
    role: string | null;
    category: string;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'spam';
    created_at: string;
}

type Props = {
    enquiries: EnquiryRow[];
    activeStatus: string;
};

const props = defineProps<Props>();

function updateStatus(enquiryId: number, status: string): void {
    router.patch(update.url(enquiryId), { status }, { preserveScroll: true });
}
</script>

<template>
    <Head title="Contact Enquiries" />

    <div class="mx-auto max-w-5xl space-y-6 p-6">
        <div>
            <h1 class="text-2xl font-semibold tracking-tight">
                Contact Enquiries Inbox
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">
                Review incoming public enquiries and update handling status.
            </p>
        </div>

        <div
            v-if="props.enquiries.length === 0"
            class="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground"
        >
            No enquiries found.
        </div>

        <div v-else class="space-y-4">
            <article
                v-for="enquiry in props.enquiries"
                :key="enquiry.id"
                class="rounded-xl border bg-card p-5"
            >
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 class="text-base font-semibold">
                            {{ enquiry.subject }}
                        </h2>
                        <p class="mt-1 text-xs text-muted-foreground">
                            {{ enquiry.name }} ({{ enquiry.email }}) ·
                            <span class="capitalize">{{
                                enquiry.category.replace('_', ' ')
                            }}</span>
                            <span v-if="enquiry.organization">
                                · {{ enquiry.organization }}
                            </span>
                        </p>
                    </div>

                    <select
                        :value="enquiry.status"
                        aria-label="Enquiry status"
                        class="rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium"
                        @change="
                            updateStatus(
                                enquiry.id,
                                ($event.target as HTMLSelectElement).value,
                            )
                        "
                    >
                        <option value="new">New</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="spam">Spam</option>
                    </select>
                </div>

                <p class="mt-3 text-sm whitespace-pre-line text-foreground/90">
                    {{ enquiry.message }}
                </p>
            </article>
        </div>
    </div>
</template>
