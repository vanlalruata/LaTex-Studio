<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import ContactForm from '@/components/public/ContactForm.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';

const page = usePage();
const publicSite = computed(() => page.props.publicSite);
</script>

<template>
    <SeoHead
        title="Contact"
        description="Reach out with product questions, technical enquiries, or institutional deployment requests."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Contact"
                title="Get in touch"
                description="Send a product enquiry, ask about institutional deployment, or reach our team."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer>
            <div class="grid gap-10 lg:grid-cols-12">
                <div class="lg:col-span-8">
                    <ContactForm v-if="publicSite?.contactFormEnabled" />
                    <div
                        v-else
                        class="rounded-2xl border border-academic-border bg-surface p-8 text-sm text-ink-muted"
                    >
                        The public contact form is currently closed.
                    </div>
                </div>

                <aside class="space-y-6 lg:col-span-4">
                    <div
                        class="rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft)"
                    >
                        <h2 class="text-base font-semibold text-ink">
                            What to expect
                        </h2>
                        <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                            Enquiries are recorded directly for our team to
                            review. Include your institution or workflow context
                            if you are evaluating a multi-user deployment.
                        </p>
                        <div
                            v-if="publicSite?.supportEmail"
                            class="mt-4 border-t border-academic-border pt-4"
                        >
                            <p
                                class="text-xs font-medium text-ink-muted uppercase"
                            >
                                Direct support email
                            </p>
                            <a
                                :href="`mailto:${publicSite.supportEmail}`"
                                class="mt-1 inline-block text-sm font-medium text-academic-primary hover:underline"
                            >
                                {{ publicSite.supportEmail }}
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </PublicContainer>
    </section>
</template>
