<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { GraduationCap } from '@lucide/vue';
import { computed, ref } from 'vue';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

interface InstitutionalDomainOption {
    domain: string;
    institution_name: string | null;
}

const props = defineProps<{
    passwordRules: string;
    institutionalDomains?: InstitutionalDomainOption[];
}>();

const emailInput = ref('');

const matchedInstitution = computed<InstitutionalDomainOption | null>(() => {
    const value = emailInput.value.trim().toLowerCase();
    const atIndex = value.lastIndexOf('@');
    if (atIndex === -1) return null;

    const domain = value.slice(atIndex + 1);
    if (!domain) return null;

    return (props.institutionalDomains ?? []).find((item) => item.domain.toLowerCase() === domain) ?? null;
});

defineOptions({
    layout: {
        title: 'Create an account',
        description: 'Enter your details below to create your account',
    },
});
</script>

<template>
    <Head title="Register" />

    <Form
        v-bind="store.form()"
        :reset-on-success="['password', 'password_confirmation']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6"
    >
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    v-focus
                    :tabindex="1"
                    autocomplete="name"
                    name="name"
                    placeholder="Full name"
                />
                <InputError :message="errors.name" />
            </div>

            <div class="grid gap-2">
                <Label for="email">Email address</Label>
                <Input
                    id="email"
                    v-model="emailInput"
                    type="email"
                    required
                    :tabindex="2"
                    autocomplete="email"
                    name="email"
                    placeholder="email@example.com"
                />
                <InputError :message="errors.email" />
                <Alert v-if="matchedInstitution" class="border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                    <GraduationCap class="size-4 text-emerald-600 dark:text-emerald-400" />
                    <AlertDescription>
                        Institutional access detected
                        <span v-if="matchedInstitution.institution_name">
                            (<strong>{{ matchedInstitution.institution_name }}</strong>)
                        </span>
                        — your account will automatically receive free access.
                    </AlertDescription>
                </Alert>
            </div>

            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <PasswordInput
                    id="password"
                    required
                    :tabindex="3"
                    autocomplete="new-password"
                    name="password"
                    placeholder="Password"
                    :passwordrules="passwordRules"
                />
                <InputError :message="errors.password" />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">Confirm password</Label>
                <PasswordInput
                    id="password_confirmation"
                    required
                    :tabindex="4"
                    autocomplete="new-password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    :passwordrules="passwordRules"
                />
                <InputError :message="errors.password_confirmation" />
            </div>

            <Button
                type="submit"
                class="mt-2 w-full"
                tabindex="5"
                :disabled="processing"
                data-test="register-user-button"
            >
                <Spinner v-if="processing" />
                Create account
            </Button>
        </div>

        <div class="text-center text-sm text-muted-foreground">
            Already have an account?
            <TextLink
                :href="login()"
                class="underline underline-offset-4"
                :tabindex="6"
                >Log in</TextLink
            >
        </div>
    </Form>
</template>
