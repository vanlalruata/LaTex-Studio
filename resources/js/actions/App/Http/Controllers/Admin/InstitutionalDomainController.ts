import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/institutional-domains',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::index
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:19
* @route '/admin/institutional-domains'
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
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::store
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:47
* @route '/admin/institutional-domains'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/institutional-domains',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::store
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:47
* @route '/admin/institutional-domains'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::store
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:47
* @route '/admin/institutional-domains'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::store
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:47
* @route '/admin/institutional-domains'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::store
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:47
* @route '/admin/institutional-domains'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::update
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:74
* @route '/admin/institutional-domains/{domain}'
*/
export const update = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/institutional-domains/{domain}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::update
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:74
* @route '/admin/institutional-domains/{domain}'
*/
update.url = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { domain: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        domain: typeof args.domain === 'object'
        ? args.domain.id
        : args.domain,
    }

    return update.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::update
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:74
* @route '/admin/institutional-domains/{domain}'
*/
update.put = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::update
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:74
* @route '/admin/institutional-domains/{domain}'
*/
const updateForm = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::update
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:74
* @route '/admin/institutional-domains/{domain}'
*/
updateForm.put = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::destroy
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:92
* @route '/admin/institutional-domains/{domain}'
*/
export const destroy = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/institutional-domains/{domain}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::destroy
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:92
* @route '/admin/institutional-domains/{domain}'
*/
destroy.url = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { domain: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        domain: typeof args.domain === 'object'
        ? args.domain.id
        : args.domain,
    }

    return destroy.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::destroy
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:92
* @route '/admin/institutional-domains/{domain}'
*/
destroy.delete = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::destroy
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:92
* @route '/admin/institutional-domains/{domain}'
*/
const destroyForm = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::destroy
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:92
* @route '/admin/institutional-domains/{domain}'
*/
destroyForm.delete = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::bulkGrant
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:111
* @route '/admin/institutional-domains/{domain}/bulk-grant'
*/
export const bulkGrant = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkGrant.url(args, options),
    method: 'post',
})

bulkGrant.definition = {
    methods: ["post"],
    url: '/admin/institutional-domains/{domain}/bulk-grant',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::bulkGrant
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:111
* @route '/admin/institutional-domains/{domain}/bulk-grant'
*/
bulkGrant.url = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { domain: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { domain: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            domain: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        domain: typeof args.domain === 'object'
        ? args.domain.id
        : args.domain,
    }

    return bulkGrant.definition.url
            .replace('{domain}', parsedArgs.domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::bulkGrant
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:111
* @route '/admin/institutional-domains/{domain}/bulk-grant'
*/
bulkGrant.post = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkGrant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::bulkGrant
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:111
* @route '/admin/institutional-domains/{domain}/bulk-grant'
*/
const bulkGrantForm = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkGrant.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InstitutionalDomainController::bulkGrant
* @see app/Http/Controllers/Admin/InstitutionalDomainController.php:111
* @route '/admin/institutional-domains/{domain}/bulk-grant'
*/
bulkGrantForm.post = (args: { domain: number | { id: number } } | [domain: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkGrant.url(args, options),
    method: 'post',
})

bulkGrant.form = bulkGrantForm

const InstitutionalDomainController = { index, store, update, destroy, bulkGrant }

export default InstitutionalDomainController