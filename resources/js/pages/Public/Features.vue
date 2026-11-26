<script setup lang="ts">
import {
    BookOpen,
    FileCode2,
    FileText,
    GitBranch,
    LayoutGrid,
    ScanLine,
    Sigma,
    Sparkles,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import FeatureCard from '@/components/public/FeatureCard.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import type { FeatureItem } from '@/types/public';

type Props = {
    features: FeatureItem[];
};

const props = defineProps<Props>();

const iconMap: Record<string, typeof FileCode2> = {
    code: FileCode2,
    'file-text': FileText,
    book: BookOpen,
    users: Users,
    sparkles: Sparkles,
    'git-branch': GitBranch,
    sigma: Sigma,
    layout: LayoutGrid,
    scan: ScanLine,
};

const categorizedFeatures = computed(() => {
    const groups = new Map<string, FeatureItem[]>();
    for (const feature of props.features) {
        const category = feature.category || 'General';
        const list = groups.get(category) ?? [];
        list.push(feature);
        groups.set(category, list);
    }
    return Array.from(groups.entries());
});
</script>

<template>
    <SeoHead
        title="Features"
        description="Explore the LaTeX editing, managed TeX Live compilation, bibliography, collaboration, and human-reviewed AI capabilities of LaTeX Studio."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Capabilities"
                title="Built for structured academic authoring"
                description="Every feature is labeled by its current release status—available today or planned on our roadmap."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer class="space-y-16">
            <div
                v-for="[category, items] in categorizedFeatures"
                :key="category"
            >
                <h2 class="mb-6 text-xl font-semibold tracking-tight text-ink">
                    {{ category }}
                </h2>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        v-for="item in items"
                        :key="item.slug"
                        :feature="{
                            ...item,
                            summary: item.description || item.summary,
                        }"
                        :icon="iconMap[item.iconKey || 'code']"
                    />
                </div>
            </div>
        </PublicContainer>
    </section>
</template>
