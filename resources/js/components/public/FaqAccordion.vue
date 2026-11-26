<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import { ref } from 'vue';
import type { FaqItem } from '@/types/public';

type Props = {
    items: FaqItem[];
};

const props = defineProps<Props>();
const openId = ref<string | null>(props.items[0]?.id ?? null);

function toggle(id: string): void {
    openId.value = openId.value === id ? null : id;
}
</script>

<template>
    <div
        class="divide-y divide-academic-border rounded-2xl border border-academic-border bg-surface shadow-(--shadow-soft)"
    >
        <div v-for="item in props.items" :key="item.id">
            <h3>
                <button
                    :id="`faq-trigger-${item.id}`"
                    type="button"
                    class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-ink transition-colors hover:bg-canvas/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-academic-primary"
                    :aria-expanded="openId === item.id"
                    :aria-controls="`faq-panel-${item.id}`"
                    @click="toggle(item.id)"
                >
                    <span>{{ item.question }}</span>
                    <ChevronDown
                        class="size-5 shrink-0 text-ink-muted transition-transform duration-200"
                        :class="{ 'rotate-180': openId === item.id }"
                        aria-hidden="true"
                    />
                </button>
            </h3>
            <div
                v-show="openId === item.id"
                :id="`faq-panel-${item.id}`"
                role="region"
                :aria-labelledby="`faq-trigger-${item.id}`"
                class="px-6 pb-5 text-sm leading-relaxed text-ink-muted"
            >
                {{ item.answer }}
            </div>
        </div>
    </div>
</template>
