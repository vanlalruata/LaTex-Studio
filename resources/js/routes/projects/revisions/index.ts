import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/revisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
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
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProjectRevisionController::index
 * @see app/Http/Controllers/ProjectRevisionController.php:26
 * @route '/projects/{project}/revisions'
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
* @see \App\Http\Controllers\ProjectRevisionController::store
 * @see app/Http/Controllers/ProjectRevisionController.php:46
 * @route '/projects/{project}/revisions'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/revisions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectRevisionController::store
 * @see app/Http/Controllers/ProjectRevisionController.php:46
 * @route '/projects/{project}/revisions'
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
* @see \App\Http\Controllers\ProjectRevisionController::store
 * @see app/Http/Controllers/ProjectRevisionController.php:46
 * @route '/projects/{project}/revisions'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProjectRevisionController::store
 * @see app/Http/Controllers/ProjectRevisionController.php:46
 * @route '/projects/{project}/revisions'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectRevisionController::store
 * @see app/Http/Controllers/ProjectRevisionController.php:46
 * @route '/projects/{project}/revisions'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
export const show = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/revisions/{revision}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
show.url = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    revision: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                revision: typeof args.revision === 'object'
                ? args.revision.public_id
                : args.revision,
                }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
show.get = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
show.head = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
    const showForm = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
        showForm.get = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProjectRevisionController::show
 * @see app/Http/Controllers/ProjectRevisionController.php:68
 * @route '/projects/{project}/revisions/{revision}'
 */
        showForm.head = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
export const diff = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: diff.url(args, options),
    method: 'get',
})

diff.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/revisions/{revision}/diff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
diff.url = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    revision: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                revision: typeof args.revision === 'object'
                ? args.revision.public_id
                : args.revision,
                }

    return diff.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
diff.get = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: diff.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
diff.head = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: diff.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
    const diffForm = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: diff.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
        diffForm.get = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: diff.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProjectRevisionController::diff
 * @see app/Http/Controllers/ProjectRevisionController.php:96
 * @route '/projects/{project}/revisions/{revision}/diff'
 */
        diffForm.head = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: diff.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    diff.form = diffForm
/**
* @see \App\Http\Controllers\ProjectRevisionController::restore
 * @see app/Http/Controllers/ProjectRevisionController.php:208
 * @route '/projects/{project}/revisions/{revision}/restore'
 */
export const restore = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/projects/{project}/revisions/{revision}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectRevisionController::restore
 * @see app/Http/Controllers/ProjectRevisionController.php:208
 * @route '/projects/{project}/revisions/{revision}/restore'
 */
restore.url = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    revision: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                revision: typeof args.revision === 'object'
                ? args.revision.public_id
                : args.revision,
                }

    return restore.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectRevisionController::restore
 * @see app/Http/Controllers/ProjectRevisionController.php:208
 * @route '/projects/{project}/revisions/{revision}/restore'
 */
restore.post = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProjectRevisionController::restore
 * @see app/Http/Controllers/ProjectRevisionController.php:208
 * @route '/projects/{project}/revisions/{revision}/restore'
 */
    const restoreForm = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectRevisionController::restore
 * @see app/Http/Controllers/ProjectRevisionController.php:208
 * @route '/projects/{project}/revisions/{revision}/restore'
 */
        restoreForm.post = (args: { project: string | { public_id: string }, revision: string | { public_id: string } } | [project: string | { public_id: string }, revision: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restore.url(args, options),
            method: 'post',
        })
    
    restore.form = restoreForm
const revisions = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
diff: Object.assign(diff, diff),
restore: Object.assign(restore, restore),
}

export default revisions