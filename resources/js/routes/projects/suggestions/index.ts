import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/suggestions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
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
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SuggestionController::index
 * @see app/Http/Controllers/SuggestionController.php:20
 * @route '/projects/{project}/suggestions'
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
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:47
 * @route '/projects/{project}/suggestions'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:47
 * @route '/projects/{project}/suggestions'
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
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:47
 * @route '/projects/{project}/suggestions'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:47
 * @route '/projects/{project}/suggestions'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuggestionController::store
 * @see app/Http/Controllers/SuggestionController.php:47
 * @route '/projects/{project}/suggestions'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SuggestionController::accept
 * @see app/Http/Controllers/SuggestionController.php:87
 * @route '/projects/{project}/suggestions/{suggestion}/accept'
 */
export const accept = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/projects/{project}/suggestions/{suggestion}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuggestionController::accept
 * @see app/Http/Controllers/SuggestionController.php:87
 * @route '/projects/{project}/suggestions/{suggestion}/accept'
 */
accept.url = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    suggestion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.public_id
                : args.suggestion,
                }

    return accept.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuggestionController::accept
 * @see app/Http/Controllers/SuggestionController.php:87
 * @route '/projects/{project}/suggestions/{suggestion}/accept'
 */
accept.post = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuggestionController::accept
 * @see app/Http/Controllers/SuggestionController.php:87
 * @route '/projects/{project}/suggestions/{suggestion}/accept'
 */
    const acceptForm = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuggestionController::accept
 * @see app/Http/Controllers/SuggestionController.php:87
 * @route '/projects/{project}/suggestions/{suggestion}/accept'
 */
        acceptForm.post = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
/**
* @see \App\Http\Controllers\SuggestionController::reject
 * @see app/Http/Controllers/SuggestionController.php:132
 * @route '/projects/{project}/suggestions/{suggestion}/reject'
 */
export const reject = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/projects/{project}/suggestions/{suggestion}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SuggestionController::reject
 * @see app/Http/Controllers/SuggestionController.php:132
 * @route '/projects/{project}/suggestions/{suggestion}/reject'
 */
reject.url = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    suggestion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                suggestion: typeof args.suggestion === 'object'
                ? args.suggestion.public_id
                : args.suggestion,
                }

    return reject.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{suggestion}', parsedArgs.suggestion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SuggestionController::reject
 * @see app/Http/Controllers/SuggestionController.php:132
 * @route '/projects/{project}/suggestions/{suggestion}/reject'
 */
reject.post = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SuggestionController::reject
 * @see app/Http/Controllers/SuggestionController.php:132
 * @route '/projects/{project}/suggestions/{suggestion}/reject'
 */
    const rejectForm = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SuggestionController::reject
 * @see app/Http/Controllers/SuggestionController.php:132
 * @route '/projects/{project}/suggestions/{suggestion}/reject'
 */
        rejectForm.post = (args: { project: string | { public_id: string }, suggestion: string | { public_id: string } } | [project: string | { public_id: string }, suggestion: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const suggestions = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
accept: Object.assign(accept, accept),
reject: Object.assign(reject, reject),
}

export default suggestions