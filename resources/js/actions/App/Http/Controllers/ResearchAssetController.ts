import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/research-assets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
index.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
            args = { project: args.public_id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                }

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ResearchAssetController::index
 * @see app/Http/Controllers/ResearchAssetController.php:14
 * @route '/projects/{project}/research-assets'
 */
        indexForm.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ResearchAssetController::store
 * @see app/Http/Controllers/ResearchAssetController.php:34
 * @route '/projects/{project}/research-assets'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/research-assets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ResearchAssetController::store
 * @see app/Http/Controllers/ResearchAssetController.php:34
 * @route '/projects/{project}/research-assets'
 */
store.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
            args = { project: args.public_id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                }

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ResearchAssetController::store
 * @see app/Http/Controllers/ResearchAssetController.php:34
 * @route '/projects/{project}/research-assets'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ResearchAssetController::store
 * @see app/Http/Controllers/ResearchAssetController.php:34
 * @route '/projects/{project}/research-assets'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ResearchAssetController::store
 * @see app/Http/Controllers/ResearchAssetController.php:34
 * @route '/projects/{project}/research-assets'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ResearchAssetController::destroy
 * @see app/Http/Controllers/ResearchAssetController.php:62
 * @route '/projects/{project}/research-assets/{asset}'
 */
export const destroy = (args: { project: string | { public_id: string }, asset: string | { public_id: string } } | [project: string | { public_id: string }, asset: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/research-assets/{asset}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ResearchAssetController::destroy
 * @see app/Http/Controllers/ResearchAssetController.php:62
 * @route '/projects/{project}/research-assets/{asset}'
 */
destroy.url = (args: { project: string | { public_id: string }, asset: string | { public_id: string } } | [project: string | { public_id: string }, asset: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    asset: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                asset: typeof args.asset === 'object'
                ? args.asset.public_id
                : args.asset,
                }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ResearchAssetController::destroy
 * @see app/Http/Controllers/ResearchAssetController.php:62
 * @route '/projects/{project}/research-assets/{asset}'
 */
destroy.delete = (args: { project: string | { public_id: string }, asset: string | { public_id: string } } | [project: string | { public_id: string }, asset: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ResearchAssetController::destroy
 * @see app/Http/Controllers/ResearchAssetController.php:62
 * @route '/projects/{project}/research-assets/{asset}'
 */
    const destroyForm = (args: { project: string | { public_id: string }, asset: string | { public_id: string } } | [project: string | { public_id: string }, asset: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ResearchAssetController::destroy
 * @see app/Http/Controllers/ResearchAssetController.php:62
 * @route '/projects/{project}/research-assets/{asset}'
 */
        destroyForm.delete = (args: { project: string | { public_id: string }, asset: string | { public_id: string } } | [project: string | { public_id: string }, asset: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ResearchAssetController = { index, store, destroy }

export default ResearchAssetController