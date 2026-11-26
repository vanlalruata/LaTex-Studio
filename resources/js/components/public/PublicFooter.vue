<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import { home, login, register } from '@/routes';
import {
    about,
    demo,
    faq,
    features,
    howItWorks,
    pricing,
    privacy,
    templates,
    terms,
} from '@/routes/public';

const page = usePage();
const publicSite = computed(() => page.props.publicSite);
const currentYear = new Date().getFullYear();

const productLinks = computed(() => {
    const links = [
        { label: 'Features', href: features.url() },
        { label: 'How it works', href: howItWorks.url() },
        { label: 'Interactive demo', href: demo.url() },
        { label: 'Templates', href: templates.url() },
    ];
    if (publicSite.value?.pricingVisible) {
        links.push({ label: 'Pricing', href: pricing.url() });
    }
    return links;
});

const resourceLinks = computed(() => {
    const links = [
        { label: 'FAQ', href: faq.url() },
        { label: 'Sign in', href: login.url() },
    ];
    if (publicSite.value?.registrationMode === 'open') {
        links.push({ label: 'Create account', href: register.url() });
    }
    return links;
});
</script>

<template>
    <footer class="border-t border-academic-border bg-surface text-ink">
        <PublicContainer class="py-12 lg:py-16">
            <div class="grid gap-10 md:grid-cols-12">
                <div class="md:col-span-5">
                    <Link
                        :href="home()"
                        class="inline-flex items-center gap-2.5 rounded-md text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                    >
                        <span
                            class="flex size-8 items-center justify-center rounded-lg bg-ink text-white"
                        >
                            <AppLogoIcon class="size-4.5" />
                        </span>
                        <span class="text-base font-semibold tracking-tight">
                            {{ publicSite?.brandName || 'LaTeX Studio' }}
                        </span>
                    </Link>
                    <p
                        class="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted"
                    >
                        {{
                            publicSite?.tagline ||
                            'A focused research-writing workspace for LaTeX manuscripts, live PDF compilation, and transparent author control.'
                        }}
                    </p>
                </div>

                <div
                    class="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7"
                >
                    <div>
                        <h3
                            class="text-xs font-semibold tracking-wider text-ink uppercase"
                        >
                            Product
                        </h3>
                        <ul class="mt-4 space-y-2.5">
                            <li v-for="link in productLinks" :key="link.label">
                                <Link
                                    :href="link.href"
                                    class="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    {{ link.label }}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3
                            class="text-xs font-semibold tracking-wider text-ink uppercase"
                        >
                            Resources
                        </h3>
                        <ul class="mt-4 space-y-2.5">
                            <li v-for="link in resourceLinks" :key="link.label">
                                <Link
                                    :href="link.href"
                                    class="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    {{ link.label }}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3
                            class="text-xs font-semibold tracking-wider text-ink uppercase"
                        >
                            Company &amp; Legal
                        </h3>
                        <ul class="mt-4 space-y-2.5">
                            <li>
                                <Link
                                    :href="about()"
                                    class="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    :href="privacy()"
                                    class="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    :href="terms()"
                                    class="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li v-if="publicSite?.supportEmail">
                                <a
                                    :href="`mailto:${publicSite.supportEmail}`"
                                    class="text-sm text-ink-muted transition-colors hover:text-ink"
                                >
                                    {{ publicSite.supportEmail }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                class="mt-12 flex flex-col items-start justify-between gap-4 border-t border-academic-border pt-8 text-xs text-ink-muted sm:flex-row sm:items-center"
            >
                <p>
                    &copy; {{ currentYear }}
                    {{ publicSite?.brandName || 'LaTeX Studio' }}. All rights
                    reserved.
                </p>
                <p>
                    Managed sandboxed TeX Live compilation &amp; structured
                    manuscript control.
                </p>
            </div>
        </PublicContainer>
    </footer>
</template>
