<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import InteractiveDemo from '@/components/public/InteractiveDemo.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import { dashboard, login, register } from '@/routes';

const page = usePage();
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));
const registrationMode = computed(
    () => page.props.publicSite?.registrationMode ?? 'open',
);
</script>

<template>
    <SeoHead
        title="Interactive Demo"
        description="Explore a safe, synthetic sample LaTeX project with file switching, source inspection, and simulated PDF preview."
    />

    <section class="border-b border-academic-border bg-canvas py-12 sm:py-16">
        <PublicContainer>
            <SectionHeading
                eyebrow="Product Preview"
                title="Explore the research-writing workspace"
                description="Switch between sample LaTeX files, inspect bibliography and figure sources, and preview the typeset sample pages."
            />
        </PublicContainer>
    </section>

    <section class="py-10 sm:py-14">
        <PublicContainer>
            <InteractiveDemo />

            <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                    v-if="isAuthenticated"
                    :href="dashboard()"
                    class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white hover:bg-academic-primary-hover"
                >
                    Open your workspace
                </Link>
                <template v-else>
                    <Link
                        v-if="registrationMode === 'open'"
                        :href="register()"
                        class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white hover:bg-academic-primary-hover"
                    >
                        Create an account
                    </Link>
                    <Link
                        :href="login()"
                        class="inline-flex items-center justify-center rounded-lg border border-academic-border bg-surface px-5 py-3 text-sm font-medium text-ink hover:bg-slate-50"
                    >
                        Sign in
                    </Link>
                </template>
            </div>
        </PublicContainer>
    </section>
</template>
