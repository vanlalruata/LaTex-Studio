import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/public-site/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::index
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:17
* @route '/admin/public-site/features'
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
* @see \App\Http\Controllers\Admin\MarketingFeatureController::store
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:28
* @route '/admin/public-site/features'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/public-site/features',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::store
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:28
* @route '/admin/public-site/features'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::store
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:28
* @route '/admin/public-site/features'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::store
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:28
* @route '/admin/public-site/features'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::store
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:28
* @route '/admin/public-site/features'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::update
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:37
* @route '/admin/public-site/features/{feature}'
*/
export const update = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/public-site/features/{feature}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::update
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:37
* @route '/admin/public-site/features/{feature}'
*/
update.url = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feature: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { feature: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            feature: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        feature: typeof args.feature === 'object'
        ? args.feature.id
        : args.feature,
    }

    return update.definition.url
            .replace('{feature}', parsedArgs.feature.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::update
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:37
* @route '/admin/public-site/features/{feature}'
*/
update.put = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::update
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:37
* @route '/admin/public-site/features/{feature}'
*/
const updateForm = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::update
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:37
* @route '/admin/public-site/features/{feature}'
*/
updateForm.put = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\MarketingFeatureController::destroy
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:48
* @route '/admin/public-site/features/{feature}'
*/
export const destroy = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/public-site/features/{feature}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::destroy
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:48
* @route '/admin/public-site/features/{feature}'
*/
destroy.url = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { feature: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { feature: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            feature: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        feature: typeof args.feature === 'object'
        ? args.feature.id
        : args.feature,
    }

    return destroy.definition.url
            .replace('{feature}', parsedArgs.feature.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::destroy
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:48
* @route '/admin/public-site/features/{feature}'
*/
destroy.delete = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::destroy
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:48
* @route '/admin/public-site/features/{feature}'
*/
const destroyForm = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\MarketingFeatureController::destroy
* @see app/Http/Controllers/Admin/MarketingFeatureController.php:48
* @route '/admin/public-site/features/{feature}'
*/
destroyForm.delete = (args: { feature: number | { id: number } } | [feature: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const features = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default features