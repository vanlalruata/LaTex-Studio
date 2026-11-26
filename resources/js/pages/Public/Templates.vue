<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { FileText } from '@lucide/vue';
import { computed } from 'vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import { dashboard, register } from '@/routes';
import type { TemplateItem } from '@/types/public';

type Props = {
    templates: TemplateItem[];
};

const props = defineProps<Props>();
const page = usePage();
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));
const registrationMode = computed(
    () => page.props.publicSite?.registrationMode ?? 'open',
);
</script>

<template>
    <SeoHead
        title="Templates"
        description="Browse academic LaTeX templates for research articles, theses, and technical reports."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Templates"
                title="Academic starting points"
                description="Clean, standard LaTeX project structures ready to customize in your workspace."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer>
            <div
                v-if="props.templates.length > 0"
                class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
                <article
                    v-for="template in props.templates"
                    :key="template.slug"
                    class="flex flex-col justify-between rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft)"
                >
                    <div>
                        <div
                            class="mb-4 flex items-center justify-between gap-2"
                        >
                            <span
                                class="inline-flex items-center gap-1.5 rounded-full border border-academic-border bg-canvas px-2.5 py-0.5 text-xs font-medium text-ink-muted capitalize"
                            >
                                <FileText class="size-3.5" aria-hidden="true" />
                                {{ template.category }}
                            </span>
                            <span class="font-mono text-xs text-ink-muted">
                                {{ template.compilerEngine }}
                            </span>
                        </div>
                        <h2 class="text-lg font-semibold text-ink">
                            {{ template.title }}
                        </h2>
                        <p
                            v-if="template.description"
                            class="mt-2 text-sm leading-relaxed text-ink-muted"
                        >
                            {{ template.description }}
                        </p>
                    </div>

                    <div
                        v-if="isAuthenticated || registrationMode === 'open'"
                        class="mt-6 border-t border-academic-border pt-4"
                    >
                        <Link
                            :href="isAuthenticated ? dashboard() : register()"
                            class="text-sm font-medium text-academic-primary hover:text-academic-primary-hover"
                        >
                            Use template in workspace &rarr;
                        </Link>
                    </div>
                </article>
            </div>

            <div
                v-else
                class="rounded-2xl border border-academic-border bg-surface p-10 text-center"
            >
                <h2 class="text-lg font-semibold text-ink">
                    Public template catalog is currently empty
                </h2>
                <p class="mt-2 text-sm text-ink-muted">
                    Sign in to your workspace to create a blank LaTeX project or
                    import existing files.
                </p>
            </div>
        </PublicContainer>
    </section>
</template>
