<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

type Props = {
    title: string;
    description: string;
    canonical?: string;
    ogType?: 'website' | 'article';
    noindex?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    ogType: 'website',
    noindex: false,
});

const page = usePage();
const brandName = computed(
    () => page.props.publicSite?.brandName || page.props.name || 'LaTeX Studio',
);
</script>

<template>
    <Head :title="props.title">
        <meta
            head-key="description"
            name="description"
            :content="props.description"
        />
        <meta
            head-key="og:title"
            property="og:title"
            :content="`${props.title} — ${brandName}`"
        />
        <meta
            head-key="og:description"
            property="og:description"
            :content="props.description"
        />
        <meta head-key="og:type" property="og:type" :content="props.ogType" />
        <meta
            head-key="twitter:card"
            name="twitter:card"
            content="summary_large_image"
        />
        <meta
            head-key="twitter:title"
            name="twitter:title"
            :content="`${props.title} — ${brandName}`"
        />
        <meta
            head-key="twitter:description"
            name="twitter:description"
            :content="props.description"
        />
        <link
            v-if="props.canonical"
            head-key="canonical"
            rel="canonical"
            :href="props.canonical"
        />
        <meta
            v-if="props.noindex"
            head-key="robots"
            name="robots"
            content="noindex, nofollow"
        />
        <slot />
    </Head>
</template>
