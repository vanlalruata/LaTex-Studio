<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { AlertTriangle, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import {
    destroyPlan,
    storePlan,
    updateSettings,
} from '@/actions/App/Http/Controllers/Admin/PublicSiteController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AdminPlan {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    price_amount: number;
    currency: string;
    billing_interval: string;
    features: string[] | null;
    cta_label: string;
    cta_type: string;
    cta_target: string | null;
    is_active: boolean;
    is_public: boolean;
    sort_order: number;
}

type Props = {
    settings: {
        pricing_mode: 'free' | 'paid' | 'contact_sales';
        pricing_page_enabled: boolean;
        pricing_currency: string;
        pricing_tax_note: string | null;
        registration_mode: 'open' | 'waitlist' | 'invite_only' | 'closed';
        contact_form_enabled: boolean;
        contact_notification_email: string | null;
        public_brand_name: string;
        public_tagline: string;
        public_support_email: string | null;
        public_announcement: string | null;
    };
    plans: AdminPlan[];
    pricingVisible: boolean;
    paidModeWithoutPlansWarning: boolean;
};

const props = defineProps<Props>();

const settingsForm = useForm({
    pricing_mode: props.settings.pricing_mode,
    pricing_page_enabled: props.settings.pricing_page_enabled,
    pricing_currency: props.settings.pricing_currency,
    pricing_tax_note: props.settings.pricing_tax_note ?? '',
    registration_mode: props.settings.registration_mode,
    contact_form_enabled: props.settings.contact_form_enabled,
    contact_notification_email: props.settings.contact_notification_email ?? '',
    public_brand_name: props.settings.public_brand_name,
    public_tagline: props.settings.public_tagline,
    public_support_email: props.settings.public_support_email ?? '',
    public_announcement: props.settings.public_announcement ?? '',
});

const planForm = useForm({
    name: '',
    slug: '',
    summary: '',
    price_amount: 0,
    currency: props.settings.pricing_currency || 'USD',
    billing_interval: 'month',
    features_text: '',
    cta_label: 'Get started',
    cta_type: 'register',
    cta_target: '',
    is_active: true,
    is_public: true,
    sort_order: 0,
});

function saveSettings(): void {
    settingsForm.submit(updateSettings(), {
        preserveScroll: true,
    });
}

function createPlan(): void {
    const features = planForm.features_text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    planForm
        .transform((data) => ({
            ...data,
            features,
            cta_target: data.cta_target || null,
            summary: data.summary || null,
        }))
        .submit(storePlan(), {
            preserveScroll: true,
            onSuccess: () => {
                planForm.reset();
            },
        });
}

const planToDelete = ref<AdminPlan | null>(null);

function removePlan(planId: number): void {
    router.delete(destroyPlan.url(planId), {
        preserveScroll: true,
        onFinish: () => {
            planToDelete.value = null;
        },
    });
}
</script>

<template>
    <Head title="Public Site Administration" />

    <div class="mx-auto max-w-5xl space-y-8 p-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">
                    Public Website &amp; Pricing Settings
                </h1>
                <p class="mt-1 text-sm text-muted-foreground">
                    Control public branding, registration mode, pricing
                    visibility, and plans.
                </p>
            </div>
            <span
                class="rounded-full border px-3 py-1 text-xs font-medium"
                :class="
                    props.pricingVisible
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-100 text-slate-700'
                "
            >
                Public pricing:
                {{ props.pricingVisible ? 'Visible' : 'Hidden' }}
            </span>
        </div>

        <Alert
            v-if="props.paidModeWithoutPlansWarning"
            class="border-amber-300 bg-amber-50 text-amber-900"
        >
            <AlertTriangle class="size-4 text-amber-700" aria-hidden="true" />
            <AlertTitle>Pricing remains hidden on the public site</AlertTitle>
            <AlertDescription class="text-amber-800">
                Paid or contact-sales mode is selected, but at least one active
                public plan and an enabled pricing page are required before
                pricing becomes visible.
            </AlertDescription>
        </Alert>

        <form
            class="space-y-6 rounded-xl border bg-card p-6"
            @submit.prevent="saveSettings"
        >
            <h2 class="text-lg font-semibold">
                General &amp; Visibility Settings
            </h2>

            <div class="grid gap-4 sm:grid-cols-2">
                <div>
                    <label class="text-sm font-medium">Pricing mode</label>
                    <select
                        v-model="settingsForm.pricing_mode"
                        class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <option value="free">Free (hide all pricing)</option>
                        <option value="paid">Paid plans</option>
                        <option value="contact_sales">Contact sales</option>
                    </select>
                </div>

                <div>
                    <label class="text-sm font-medium">Registration mode</label>
                    <select
                        v-model="settingsForm.registration_mode"
                        class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <option value="open">Open registration</option>
                        <option value="waitlist">Waitlist</option>
                        <option value="invite_only">Invite only</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label class="text-sm font-medium">Brand name</label>
                    <input
                        v-model="settingsForm.public_brand_name"
                        type="text"
                        class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label class="text-sm font-medium"
                        >Support email (optional public)</label
                    >
                    <input
                        v-model="settingsForm.public_support_email"
                        type="email"
                        class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div class="flex flex-wrap gap-6">
                <label class="flex items-center gap-2 text-sm">
                    <input
                        v-model="settingsForm.pricing_page_enabled"
                        type="checkbox"
                        class="rounded border"
                    />
                    <span>Enable public pricing page</span>
                </label>

                <label class="flex items-center gap-2 text-sm">
                    <input
                        v-model="settingsForm.contact_form_enabled"
                        type="checkbox"
                        class="rounded border"
                    />
                    <span>Enable public contact form</span>
                </label>
            </div>

            <button
                type="submit"
                :disabled="settingsForm.processing"
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
                Save settings
            </button>
        </form>

        <div class="space-y-6 rounded-xl border bg-card p-6">
            <h2 class="text-lg font-semibold">Pricing Plans</h2>

            <div
                v-if="props.plans.length > 0"
                class="divide-y rounded-lg border"
            >
                <div
                    v-for="plan in props.plans"
                    :key="plan.id"
                    class="flex items-center justify-between gap-4 p-4"
                >
                    <div>
                        <p class="font-medium">
                            {{ plan.name }}
                            <span
                                class="ml-2 font-mono text-xs text-muted-foreground"
                            >
                                {{ plan.currency }}
                                {{ (plan.price_amount / 100).toFixed(2) }} /
                                {{ plan.billing_interval }}
                            </span>
                        </p>
                        <p class="text-xs text-muted-foreground">
                            {{ plan.is_active ? 'Active' : 'Inactive' }} ·
                            {{ plan.is_public ? 'Public' : 'Private' }}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                        @click="planToDelete = plan"
                    >
                        <Trash2 class="size-3.5" />
                        Delete
                    </button>
                </div>
            </div>

            <form class="space-y-4 border-t pt-6" @submit.prevent="createPlan">
                <h3 class="text-sm font-semibold">Add pricing plan</h3>
                <div class="grid gap-4 sm:grid-cols-3">
                    <input
                        v-model="planForm.name"
                        type="text"
                        placeholder="Plan name"
                        class="rounded-md border bg-background px-3 py-2 text-sm"
                        required
                    />
                    <input
                        v-model="planForm.slug"
                        type="text"
                        placeholder="plan-slug"
                        class="rounded-md border bg-background px-3 py-2 text-sm"
                        required
                    />
                    <input
                        v-model.number="planForm.price_amount"
                        type="number"
                        min="0"
                        placeholder="Amount (minor units, e.g. 1200)"
                        class="rounded-md border bg-background px-3 py-2 text-sm"
                        required
                    />
                </div>
                <textarea
                    v-model="planForm.features_text"
                    rows="3"
                    placeholder="One feature per line"
                    class="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                <div class="flex flex-wrap items-center gap-6">
                    <label class="flex items-center gap-2 text-sm">
                        <input v-model="planForm.is_active" type="checkbox" />
                        <span>Active</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm">
                        <input v-model="planForm.is_public" type="checkbox" />
                        <span>Public</span>
                    </label>
                    <button
                        type="submit"
                        :disabled="planForm.processing"
                        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                        Add plan
                    </button>
                </div>
            </form>
        </div>

        <AlertDialog
            :open="planToDelete !== null"
            @update:open="
                (open) => {
                    if (!open) planToDelete = null;
                }
            "
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete pricing plan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete
                        <strong>{{ planToDelete?.name }}</strong>? This action
                        cannot be undone and will immediately update public
                        pricing visibility.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        class="bg-destructive text-white hover:bg-destructive/90"
                        @click="planToDelete && removePlan(planToDelete.id)"
                    >
                        Delete plan
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
