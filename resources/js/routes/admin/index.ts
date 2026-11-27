import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import publicSite from './public-site'
import users from './users'
import projects from './projects'
import organizations from './organizations'
import audit from './audit'
import usage from './usage'
import compiler from './compiler'
import buildQueue from './build-queue'
import institutionalDomains from './institutional-domains'
/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OverviewController::__invoke
* @see app/Http/Controllers/Admin/OverviewController.php:18
* @route '/admin'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

const admin = {
    publicSite: Object.assign(publicSite, publicSite),
    dashboard: Object.assign(dashboard, dashboard),
    users: Object.assign(users, users),
    projects: Object.assign(projects, projects),
    organizations: Object.assign(organizations, organizations),
    audit: Object.assign(audit, audit),
    usage: Object.assign(usage, usage),
    compiler: Object.assign(compiler, compiler),
    buildQueue: Object.assign(buildQueue, buildQueue),
    institutionalDomains: Object.assign(institutionalDomains, institutionalDomains),
}

export default admin