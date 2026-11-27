import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
export const update = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/organizations/{organization}/quota',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
update.url = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
update.patch = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
const updateForm = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrganizationController::update
* @see app/Http/Controllers/Admin/OrganizationController.php:36
* @route '/admin/organizations/{organization}/quota'
*/
updateForm.patch = (args: { organization: string | number | { id: string | number } } | [organization: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const quota = {
    update: Object.assign(update, update),
}

export default quota