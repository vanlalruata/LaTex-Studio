<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    BookOpen,
    Building,
    ClipboardList,
    Activity,
    Cpu,
    FolderGit2,
    GraduationCap,
    LayoutGrid,
    ScrollText,
    ServerCog,
    Settings2,
    Sparkles,
    Files,
    Users,
} from '@lucide/vue';
import { usePage } from '@inertiajs/vue3';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as publicSiteIndex } from '@/routes/admin/public-site';
import { index as featuresIndex } from '@/routes/admin/public-site/features';
import { index as enquiriesIndex } from '@/routes/admin/public-site/enquiries';
import { index as templatesIndex } from '@/routes/admin/public-site/templates';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as usersIndex } from '@/routes/admin/users';
import { index as projectsIndex } from '@/routes/admin/projects';
import { index as organizationsIndex } from '@/routes/admin/organizations';
import { index as auditIndex } from '@/routes/admin/audit';
import { index as buildQueueIndex } from '@/routes/admin/build-queue';
import { index as compilerIndex } from '@/routes/admin/compiler';
import { index as institutionalDomainsIndex } from '@/routes/admin/institutional-domains';
import { index as usageIndex } from '@/routes/admin/usage';
import type { NavItem } from '@/types';

const page = usePage();

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: adminDashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: usersIndex(),
        icon: Users,
    },
    {
        title: 'Projects',
        href: projectsIndex(),
        icon: FolderGit2,
    },
    {
        title: 'Organizations',
        href: organizationsIndex(),
        icon: Building,
    },
    {
        title: 'Public site settings',
        href: publicSiteIndex(),
        icon: Settings2,
    },
    {
        title: 'Marketing features',
        href: featuresIndex(),
        icon: Sparkles,
    },
    {
        title: 'Template catalog',
        href: templatesIndex(),
        icon: Files,
    },
    {
        title: 'Contact enquiries',
        href: enquiriesIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Audit log',
        href: auditIndex(),
        icon: ScrollText,
    },
    {
        title: 'Usage & builds',
        href: usageIndex(),
        icon: Activity,
    },
    {
        title: 'Compiler settings',
        href: compilerIndex(),
        icon: ServerCog,
    },
    {
        title: 'Build queue',
        href: buildQueueIndex(),
        icon: Cpu,
    },
    {
        title: 'Institutional access',
        href: institutionalDomainsIndex(),
        icon: GraduationCap,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
            <NavMain
                v-if="page.props.auth.canManageAdmin"
                :items="adminNavItems"
                label="Administration"
            />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
