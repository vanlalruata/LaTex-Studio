import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
* @see app/Http/Controllers/Admin/OrganizationController.php:15
* @route '/admin/organizations'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\OrganizationController::updateQuota
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
export const updateQuota = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateQuota.url(args, options),
    method: 'patch',
})

updateQuota.definition = {
    methods: ["patch"],
    url: '/admin/organizations/{organization}/quota',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::updateQuota
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
updateQuota.url = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        organization: typeof args.organization === 'object'
        ? args.organization.id
        : args.organization,
    }

    return updateQuota.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::updateQuota
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
updateQuota.patch = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateQuota.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::updateQuota
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
const updateQuotaForm = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateQuota.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::updateQuota
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
updateQuotaForm.patch = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateQuota.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateQuota.form = updateQuotaForm

const OrganizationController = { index, updateQuota }

export default OrganizationController