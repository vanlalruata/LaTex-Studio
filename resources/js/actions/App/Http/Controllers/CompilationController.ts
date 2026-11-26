import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:23
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
 * @see app/Http/Controllers/CompilationController.php:23
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
 * @see app/Http/Controllers/CompilationController.php:23
 * @route '/projects/{project}/compilations'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:23
 * @route '/projects/{project}/compilations'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::store
 * @see app/Http/Controllers/CompilationController.php:23
 * @route '/projects/{project}/compilations'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompilationController::updateEngine
 * @see app/Http/Controllers/CompilationController.php:134
 * @route '/projects/{project}/compiler-engine'
 */
export const updateEngine = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateEngine.url(args, options),
    method: 'put',
})

updateEngine.definition = {
    methods: ["put"],
    url: '/projects/{project}/compiler-engine',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CompilationController::updateEngine
 * @see app/Http/Controllers/CompilationController.php:134
 * @route '/projects/{project}/compiler-engine'
 */
updateEngine.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return updateEngine.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::updateEngine
 * @see app/Http/Controllers/CompilationController.php:134
 * @route '/projects/{project}/compiler-engine'
 */
updateEngine.put = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateEngine.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CompilationController::updateEngine
 * @see app/Http/Controllers/CompilationController.php:134
 * @route '/projects/{project}/compiler-engine'
 */
    const updateEngineForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateEngine.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::updateEngine
 * @see app/Http/Controllers/CompilationController.php:134
 * @route '/projects/{project}/compiler-engine'
 */
        updateEngineForm.put = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateEngine.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateEngine.form = updateEngineForm
/**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:48
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
 * @see app/Http/Controllers/CompilationController.php:48
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
 * @see app/Http/Controllers/CompilationController.php:48
 * @route '/compilations/{compilation}'
 */
show.get = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:48
 * @route '/compilations/{compilation}'
 */
show.head = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:48
 * @route '/compilations/{compilation}'
 */
    const showForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:48
 * @route '/compilations/{compilation}'
 */
        showForm.get = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompilationController::show
 * @see app/Http/Controllers/CompilationController.php:48
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
* @see \App\Http\Controllers\CompilationController::cancel
 * @see app/Http/Controllers/CompilationController.php:80
 * @route '/compilations/{compilation}/cancel'
 */
export const cancel = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::cancel
 * @see app/Http/Controllers/CompilationController.php:80
 * @route '/compilations/{compilation}/cancel'
 */
cancel.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::cancel
 * @see app/Http/Controllers/CompilationController.php:80
 * @route '/compilations/{compilation}/cancel'
 */
cancel.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompilationController::cancel
 * @see app/Http/Controllers/CompilationController.php:80
 * @route '/compilations/{compilation}/cancel'
 */
    const cancelForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::cancel
 * @see app/Http/Controllers/CompilationController.php:80
 * @route '/compilations/{compilation}/cancel'
 */
        cancelForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\CompilationController::retry
 * @see app/Http/Controllers/CompilationController.php:102
 * @route '/compilations/{compilation}/retry'
 */
export const retry = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::retry
 * @see app/Http/Controllers/CompilationController.php:102
 * @route '/compilations/{compilation}/retry'
 */
retry.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return retry.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::retry
 * @see app/Http/Controllers/CompilationController.php:102
 * @route '/compilations/{compilation}/retry'
 */
retry.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompilationController::retry
 * @see app/Http/Controllers/CompilationController.php:102
 * @route '/compilations/{compilation}/retry'
 */
    const retryForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::retry
 * @see app/Http/Controllers/CompilationController.php:102
 * @route '/compilations/{compilation}/retry'
 */
        retryForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \App\Http\Controllers\CompilationController::forwardSynctex
 * @see app/Http/Controllers/CompilationController.php:158
 * @route '/compilations/{compilation}/synctex/forward'
 */
export const forwardSynctex = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forwardSynctex.url(args, options),
    method: 'post',
})

forwardSynctex.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/synctex/forward',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::forwardSynctex
 * @see app/Http/Controllers/CompilationController.php:158
 * @route '/compilations/{compilation}/synctex/forward'
 */
forwardSynctex.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return forwardSynctex.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::forwardSynctex
 * @see app/Http/Controllers/CompilationController.php:158
 * @route '/compilations/{compilation}/synctex/forward'
 */
forwardSynctex.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forwardSynctex.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompilationController::forwardSynctex
 * @see app/Http/Controllers/CompilationController.php:158
 * @route '/compilations/{compilation}/synctex/forward'
 */
    const forwardSynctexForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: forwardSynctex.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::forwardSynctex
 * @see app/Http/Controllers/CompilationController.php:158
 * @route '/compilations/{compilation}/synctex/forward'
 */
        forwardSynctexForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: forwardSynctex.url(args, options),
            method: 'post',
        })
    
    forwardSynctex.form = forwardSynctexForm
/**
* @see \App\Http\Controllers\CompilationController::inverseSynctex
 * @see app/Http/Controllers/CompilationController.php:194
 * @route '/compilations/{compilation}/synctex/inverse'
 */
export const inverseSynctex = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inverseSynctex.url(args, options),
    method: 'post',
})

inverseSynctex.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/synctex/inverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::inverseSynctex
 * @see app/Http/Controllers/CompilationController.php:194
 * @route '/compilations/{compilation}/synctex/inverse'
 */
inverseSynctex.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return inverseSynctex.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::inverseSynctex
 * @see app/Http/Controllers/CompilationController.php:194
 * @route '/compilations/{compilation}/synctex/inverse'
 */
inverseSynctex.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inverseSynctex.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompilationController::inverseSynctex
 * @see app/Http/Controllers/CompilationController.php:194
 * @route '/compilations/{compilation}/synctex/inverse'
 */
    const inverseSynctexForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: inverseSynctex.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompilationController::inverseSynctex
 * @see app/Http/Controllers/CompilationController.php:194
 * @route '/compilations/{compilation}/synctex/inverse'
 */
        inverseSynctexForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: inverseSynctex.url(args, options),
            method: 'post',
        })
    
    inverseSynctex.form = inverseSynctexForm
/**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:231
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
 * @see app/Http/Controllers/CompilationController.php:231
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
 * @see app/Http/Controllers/CompilationController.php:231
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
artifact.get = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artifact.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:231
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
artifact.head = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: artifact.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:231
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
    const artifactForm = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: artifact.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:231
 * @route '/compilations/{compilation}/artifacts/{type}'
 */
        artifactForm.get = (args: { compilation: string | { public_id: string }, type: string | number } | [compilation: string | { public_id: string }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artifact.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompilationController::artifact
 * @see app/Http/Controllers/CompilationController.php:231
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
const CompilationController = { store, updateEngine, show, cancel, retry, forwardSynctex, inverseSynctex, artifact }

export default CompilationController