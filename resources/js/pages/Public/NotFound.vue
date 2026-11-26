<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import { home } from '@/routes';
</script>

<template>
    <SeoHead
        title="Page not found"
        description="The requested page could not be found."
        :noindex="true"
    />

    <section class="py-20 sm:py-28">
        <PublicContainer narrow class="text-center">
            <p
                class="text-xs font-semibold tracking-wider text-academic-primary uppercase"
            >
                404
            </p>
            <h1
                class="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
                Page not found
            </h1>
            <p class="mt-4 text-base text-ink-muted">
                The page you are looking for does not exist or has been moved.
            </p>
            <div class="mt-8 flex justify-center">
                <Link
                    :href="home()"
                    class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                >
                    Return home
                </Link>
            </div>
        </PublicContainer>
    </section>
</template>
