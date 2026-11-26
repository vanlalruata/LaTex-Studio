import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:17
 * @route '/projects/{project}/compilations'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/compilations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:17
 * @route '/projects/{project}/compilations'
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
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:17
 * @route '/projects/{project}/compilations'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:17
 * @route '/projects/{project}/compilations'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:17
 * @route '/projects/{project}/compilations'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
export const show = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/compilations/{compilation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
show.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compilation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
            args = { compilation: args.public_id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compilation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compilation: typeof args.compilation === 'object'
                ? args.compilation.public_id
                : args.compilation,
                }

    return show.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
show.get = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
show.head = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
    const showForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
        showForm.get = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:42
 * @route '/compilations/{compilation}'
 */
        showForm.head = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
export const artifact = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artifact.url(args, options),
    method: 'get',
})

artifact.definition = {
    methods: ["get","head"],
    url: '/compilations/{compilation}/artifacts/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
artifact.url = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    compilation: args[0],
                    type: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compilation: typeof args.compilation === 'object'
                ? args.compilation.public_id
                : args.compilation,
                                type: args.type,
                }

    return artifact.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
artifact.get = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artifact.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
artifact.head = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: artifact.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
    const artifactForm = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: artifact.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
        artifactForm.get = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artifact.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:67
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
        artifactForm.head = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artifact.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    artifact.form = artifactForm
const CompilationController = { store, show, artifact }

export default CompilationController