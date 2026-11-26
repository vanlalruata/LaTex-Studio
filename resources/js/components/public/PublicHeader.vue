<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { Menu, X } from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import { dashboard, home, login, register } from '@/routes';
import { about, features, howItWorks, templates } from '@/routes/public';

const page = usePage();
const mobileMenuOpen = ref(false);
const menuToggleRef = ref<HTMLButtonElement | null>(null);

const publicSite = computed(() => page.props.publicSite);
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));

const navLinks = computed(() => {
    const items = [
        { label: 'Features', href: features.url() },
        { label: 'How it works', href: howItWorks.url() },
        { label: 'Templates', href: templates.url() },
    ];

    if (publicSite.value?.pricingVisible) {
        items.push({ label: 'Pricing', href: '/pricing' });
    }

    items.push({ label: 'About', href: about.url() });

    return items;
});

const primaryCta = computed(() => {
    const mode = publicSite.value?.registrationMode ?? 'open';
    if (mode === 'open') {
        return { label: 'Get started', href: register.url(), visible: true };
    }
    if (mode === 'waitlist') {
        return {
            label: 'Join the waitlist',
            href: '/#waitlist',
            visible: true,
        };
    }
    if (mode === 'invite_only') {
        return { label: 'Request access', href: '/#contact', visible: true };
    }
    return { label: '', href: '', visible: false };
});

function closeMenu(returnFocus = false): void {
    mobileMenuOpen.value = false;
    if (returnFocus) {
        menuToggleRef.value?.focus();
    }
}

function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && mobileMenuOpen.value) {
        closeMenu(true);
    }
}

let removeNavigateListener: (() => void) | null = null;

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    removeNavigateListener = router.on('navigate', () => {
        closeMenu(false);
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    removeNavigateListener?.();
});
</script>

<template>
    <header
        class="sticky top-0 z-40 border-b border-academic-border bg-canvas/95 backdrop-blur-sm"
    >
        <div
            v-if="publicSite?.announcement"
            class="border-b border-academic-border bg-ink px-4 py-2 text-center text-xs font-medium text-white"
        >
            <Link
                v-if="publicSite.announcement.href"
                :href="publicSite.announcement.href"
                class="underline decoration-white/50 underline-offset-4 hover:decoration-white"
            >
                {{ publicSite.announcement.text }}
            </Link>
            <span v-else>{{ publicSite.announcement.text }}</span>
        </div>

        <PublicContainer>
            <div class="flex h-16 items-center justify-between gap-4">
                <Link
                    :href="home()"
                    class="flex shrink-0 items-center gap-2.5 rounded-md text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
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

                <nav
                    aria-label="Primary navigation"
                    class="hidden items-center gap-6 md:flex"
                >
                    <Link
                        v-for="item in navLinks"
                        :key="item.label"
                        :href="item.href"
                        class="text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-academic-primary"
                    >
                        {{ item.label }}
                    </Link>
                </nav>

                <div class="hidden items-center gap-3 md:flex">
                    <template v-if="isAuthenticated">
                        <Link
                            :href="dashboard()"
                            class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                        >
                            Open workspace
                        </Link>
                    </template>
                    <template v-else>
                        <Link
                            :href="login()"
                            class="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                        >
                            Sign in
                        </Link>
                        <Link
                            v-if="primaryCta.visible"
                            :href="primaryCta.href"
                            class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                        >
                            {{ primaryCta.label }}
                        </Link>
                    </template>
                </div>

                <button
                    ref="menuToggleRef"
                    type="button"
                    class="inline-flex size-10 items-center justify-center rounded-lg border border-academic-border bg-surface text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary md:hidden"
                    :aria-expanded="mobileMenuOpen"
                    aria-controls="public-mobile-menu"
                    aria-label="Toggle navigation menu"
                    @click="mobileMenuOpen = !mobileMenuOpen"
                >
                    <X
                        v-if="mobileMenuOpen"
                        class="size-5"
                        aria-hidden="true"
                    />
                    <Menu v-else class="size-5" aria-hidden="true" />
                </button>
            </div>
        </PublicContainer>

        <div
            v-if="mobileMenuOpen"
            id="public-mobile-menu"
            class="border-t border-academic-border bg-surface md:hidden"
        >
            <PublicContainer class="py-4">
                <nav aria-label="Mobile navigation" class="flex flex-col gap-1">
                    <Link
                        v-for="item in navLinks"
                        :key="item.label"
                        :href="item.href"
                        class="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
                        @click="closeMenu(false)"
                    >
                        {{ item.label }}
                    </Link>
                </nav>

                <div
                    class="mt-4 flex flex-col gap-2 border-t border-academic-border pt-4"
                >
                    <template v-if="isAuthenticated">
                        <Link
                            :href="dashboard()"
                            class="inline-flex w-full items-center justify-center rounded-lg bg-academic-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-academic-primary-hover"
                            @click="closeMenu(false)"
                        >
                            Open workspace
                        </Link>
                    </template>
                    <template v-else>
                        <Link
                            :href="login()"
                            class="inline-flex w-full items-center justify-center rounded-lg border border-academic-border bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:bg-canvas"
                            @click="closeMenu(false)"
                        >
                            Sign in
                        </Link>
                        <Link
                            v-if="primaryCta.visible"
                            :href="primaryCta.href"
                            class="inline-flex w-full items-center justify-center rounded-lg bg-academic-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-academic-primary-hover"
                            @click="closeMenu(false)"
                        >
                            {{ primaryCta.label }}
                        </Link>
                    </template>
                </div>
            </PublicContainer>
        </div>
    </header>
</template>
