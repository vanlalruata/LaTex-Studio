import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
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
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FigureController::index
 * @see app/Http/Controllers/FigureController.php:17
 * @route '/projects/{project}/figures'
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
* @see \App\Http\Controllers\FigureController::store
 * @see app/Http/Controllers/FigureController.php:72
 * @route '/projects/{project}/figures'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureController::store
 * @see app/Http/Controllers/FigureController.php:72
 * @route '/projects/{project}/figures'
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
* @see \App\Http\Controllers\FigureController::store
 * @see app/Http/Controllers/FigureController.php:72
 * @route '/projects/{project}/figures'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FigureController::store
 * @see app/Http/Controllers/FigureController.php:72
 * @route '/projects/{project}/figures'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FigureController::store
 * @see app/Http/Controllers/FigureController.php:72
 * @route '/projects/{project}/figures'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
export const show = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures/{figure}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
show.url = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    figure: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                figure: typeof args.figure === 'object'
                ? args.figure.public_id
                : args.figure,
                }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
show.get = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
show.head = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
    const showForm = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
        showForm.get = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FigureController::show
 * @see app/Http/Controllers/FigureController.php:46
 * @route '/projects/{project}/figures/{figure}'
 */
        showForm.head = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FigureController::update
 * @see app/Http/Controllers/FigureController.php:98
 * @route '/projects/{project}/figures/{figure}'
 */
export const update = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/figures/{figure}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FigureController::update
 * @see app/Http/Controllers/FigureController.php:98
 * @route '/projects/{project}/figures/{figure}'
 */
update.url = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    figure: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                figure: typeof args.figure === 'object'
                ? args.figure.public_id
                : args.figure,
                }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::update
 * @see app/Http/Controllers/FigureController.php:98
 * @route '/projects/{project}/figures/{figure}'
 */
update.put = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FigureController::update
 * @see app/Http/Controllers/FigureController.php:98
 * @route '/projects/{project}/figures/{figure}'
 */
    const updateForm = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FigureController::update
 * @see app/Http/Controllers/FigureController.php:98
 * @route '/projects/{project}/figures/{figure}'
 */
        updateForm.put = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\FigureController::destroy
 * @see app/Http/Controllers/FigureController.php:125
 * @route '/projects/{project}/figures/{figure}'
 */
export const destroy = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/figures/{figure}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FigureController::destroy
 * @see app/Http/Controllers/FigureController.php:125
 * @route '/projects/{project}/figures/{figure}'
 */
destroy.url = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    figure: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                figure: typeof args.figure === 'object'
                ? args.figure.public_id
                : args.figure,
                }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::destroy
 * @see app/Http/Controllers/FigureController.php:125
 * @route '/projects/{project}/figures/{figure}'
 */
destroy.delete = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FigureController::destroy
 * @see app/Http/Controllers/FigureController.php:125
 * @route '/projects/{project}/figures/{figure}'
 */
    const destroyForm = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FigureController::destroy
 * @see app/Http/Controllers/FigureController.php:125
 * @route '/projects/{project}/figures/{figure}'
 */
        destroyForm.delete = (args: { project: string | { public_id: string }, figure: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const figures = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default figures