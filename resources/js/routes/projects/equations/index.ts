import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import revisions from './revisions'
import comments from './comments'
/**
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/equations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
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
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EquationController::index
 * @see app/Http/Controllers/EquationController.php:33
 * @route '/projects/{project}/equations'
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
* @see \App\Http\Controllers\EquationController::store
 * @see app/Http/Controllers/EquationController.php:103
 * @route '/projects/{project}/equations'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::store
 * @see app/Http/Controllers/EquationController.php:103
 * @route '/projects/{project}/equations'
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
* @see \App\Http\Controllers\EquationController::store
 * @see app/Http/Controllers/EquationController.php:103
 * @route '/projects/{project}/equations'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EquationController::store
 * @see app/Http/Controllers/EquationController.php:103
 * @route '/projects/{project}/equations'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EquationController::store
 * @see app/Http/Controllers/EquationController.php:103
 * @route '/projects/{project}/equations'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EquationController::insert
 * @see app/Http/Controllers/EquationController.php:207
 * @route '/projects/{project}/equations/insert'
 */
export const insert = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insert.url(args, options),
    method: 'post',
})

insert.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/insert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::insert
 * @see app/Http/Controllers/EquationController.php:207
 * @route '/projects/{project}/equations/insert'
 */
insert.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return insert.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::insert
 * @see app/Http/Controllers/EquationController.php:207
 * @route '/projects/{project}/equations/insert'
 */
insert.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insert.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EquationController::insert
 * @see app/Http/Controllers/EquationController.php:207
 * @route '/projects/{project}/equations/insert'
 */
    const insertForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: insert.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EquationController::insert
 * @see app/Http/Controllers/EquationController.php:207
 * @route '/projects/{project}/equations/insert'
 */
        insertForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: insert.url(args, options),
            method: 'post',
        })
    
    insert.form = insertForm
/**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
export const show = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/equations/{equation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
show.url = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    equation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                equation: typeof args.equation === 'object'
                ? args.equation.public_id
                : args.equation,
                }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
show.get = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
show.head = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
    const showForm = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
        showForm.get = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EquationController::show
 * @see app/Http/Controllers/EquationController.php:71
 * @route '/projects/{project}/equations/{equation}'
 */
        showForm.head = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EquationController::update
 * @see app/Http/Controllers/EquationController.php:135
 * @route '/projects/{project}/equations/{equation}'
 */
export const update = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/equations/{equation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EquationController::update
 * @see app/Http/Controllers/EquationController.php:135
 * @route '/projects/{project}/equations/{equation}'
 */
update.url = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    equation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                equation: typeof args.equation === 'object'
                ? args.equation.public_id
                : args.equation,
                }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::update
 * @see app/Http/Controllers/EquationController.php:135
 * @route '/projects/{project}/equations/{equation}'
 */
update.put = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EquationController::update
 * @see app/Http/Controllers/EquationController.php:135
 * @route '/projects/{project}/equations/{equation}'
 */
    const updateForm = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EquationController::update
 * @see app/Http/Controllers/EquationController.php:135
 * @route '/projects/{project}/equations/{equation}'
 */
        updateForm.put = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EquationController::destroy
 * @see app/Http/Controllers/EquationController.php:170
 * @route '/projects/{project}/equations/{equation}'
 */
export const destroy = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/equations/{equation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EquationController::destroy
 * @see app/Http/Controllers/EquationController.php:170
 * @route '/projects/{project}/equations/{equation}'
 */
destroy.url = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    equation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                equation: typeof args.equation === 'object'
                ? args.equation.public_id
                : args.equation,
                }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::destroy
 * @see app/Http/Controllers/EquationController.php:170
 * @route '/projects/{project}/equations/{equation}'
 */
destroy.delete = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EquationController::destroy
 * @see app/Http/Controllers/EquationController.php:170
 * @route '/projects/{project}/equations/{equation}'
 */
    const destroyForm = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EquationController::destroy
 * @see app/Http/Controllers/EquationController.php:170
 * @route '/projects/{project}/equations/{equation}'
 */
        destroyForm.delete = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EquationController::compilePreview
 * @see app/Http/Controllers/EquationController.php:269
 * @route '/projects/{project}/equations/{equation}/compile-preview'
 */
export const compilePreview = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compilePreview.url(args, options),
    method: 'post',
})

compilePreview.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/compile-preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::compilePreview
 * @see app/Http/Controllers/EquationController.php:269
 * @route '/projects/{project}/equations/{equation}/compile-preview'
 */
compilePreview.url = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    equation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                equation: typeof args.equation === 'object'
                ? args.equation.public_id
                : args.equation,
                }

    return compilePreview.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::compilePreview
 * @see app/Http/Controllers/EquationController.php:269
 * @route '/projects/{project}/equations/{equation}/compile-preview'
 */
compilePreview.post = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compilePreview.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EquationController::compilePreview
 * @see app/Http/Controllers/EquationController.php:269
 * @route '/projects/{project}/equations/{equation}/compile-preview'
 */
    const compilePreviewForm = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: compilePreview.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EquationController::compilePreview
 * @see app/Http/Controllers/EquationController.php:269
 * @route '/projects/{project}/equations/{equation}/compile-preview'
 */
        compilePreviewForm.post = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: compilePreview.url(args, options),
            method: 'post',
        })
    
    compilePreview.form = compilePreviewForm
/**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
export const previewPdf = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPdf.url(args, options),
    method: 'get',
})

previewPdf.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/equations/{equation}/preview.pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
previewPdf.url = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    equation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                equation: typeof args.equation === 'object'
                ? args.equation.public_id
                : args.equation,
                }

    return previewPdf.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
previewPdf.get = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
previewPdf.head = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
    const previewPdfForm = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
        previewPdfForm.get = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EquationController::previewPdf
 * @see app/Http/Controllers/EquationController.php:337
 * @route '/projects/{project}/equations/{equation}/preview.pdf'
 */
        previewPdfForm.head = (args: { project: string | { public_id: string }, equation: string | { public_id: string } } | [project: string | { public_id: string }, equation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewPdf.form = previewPdfForm
const equations = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
insert: Object.assign(insert, insert),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
revisions: Object.assign(revisions, revisions),
compilePreview: Object.assign(compilePreview, compilePreview),
previewPdf: Object.assign(previewPdf, previewPdf),
comments: Object.assign(comments, comments),
}

export default equations