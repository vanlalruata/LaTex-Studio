import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FigureController::index
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
export const index = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureController::index
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
index.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
index.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::index
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
index.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FigureController::index
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
const indexForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::index
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::index
* @see app/Http/Controllers/FigureController.php:29
* @route '/projects/{project}/figures'
*/
indexForm.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/FigureController.php:105
* @route '/projects/{project}/figures'
*/
export const store = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureController::store
* @see app/Http/Controllers/FigureController.php:105
* @route '/projects/{project}/figures'
*/
store.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/FigureController.php:105
* @route '/projects/{project}/figures'
*/
store.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::store
* @see app/Http/Controllers/FigureController.php:105
* @route '/projects/{project}/figures'
*/
const storeForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::store
* @see app/Http/Controllers/FigureController.php:105
* @route '/projects/{project}/figures'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FigureController::insertIntoFile
* @see app/Http/Controllers/FigureController.php:224
* @route '/projects/{project}/figures/insert'
*/
export const insertIntoFile = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insertIntoFile.url(args, options),
    method: 'post',
})

insertIntoFile.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures/insert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureController::insertIntoFile
* @see app/Http/Controllers/FigureController.php:224
* @route '/projects/{project}/figures/insert'
*/
insertIntoFile.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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

    return insertIntoFile.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::insertIntoFile
* @see app/Http/Controllers/FigureController.php:224
* @route '/projects/{project}/figures/insert'
*/
insertIntoFile.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insertIntoFile.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::insertIntoFile
* @see app/Http/Controllers/FigureController.php:224
* @route '/projects/{project}/figures/insert'
*/
const insertIntoFileForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: insertIntoFile.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::insertIntoFile
* @see app/Http/Controllers/FigureController.php:224
* @route '/projects/{project}/figures/insert'
*/
insertIntoFileForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: insertIntoFile.url(args, options),
    method: 'post',
})

insertIntoFile.form = insertIntoFileForm

/**
* @see \App\Http\Controllers\FigureController::show
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
export const show = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures/{figure}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureController::show
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
show.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
show.get = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::show
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
show.head = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FigureController::show
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
const showForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::show
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
showForm.get = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::show
* @see app/Http/Controllers/FigureController.php:70
* @route '/projects/{project}/figures/{figure}'
*/
showForm.head = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/FigureController.php:134
* @route '/projects/{project}/figures/{figure}'
*/
export const update = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/figures/{figure}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FigureController::update
* @see app/Http/Controllers/FigureController.php:134
* @route '/projects/{project}/figures/{figure}'
*/
update.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/FigureController.php:134
* @route '/projects/{project}/figures/{figure}'
*/
update.put = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FigureController::update
* @see app/Http/Controllers/FigureController.php:134
* @route '/projects/{project}/figures/{figure}'
*/
const updateForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/FigureController.php:134
* @route '/projects/{project}/figures/{figure}'
*/
updateForm.put = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/FigureController.php:167
* @route '/projects/{project}/figures/{figure}'
*/
export const destroy = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/figures/{figure}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FigureController::destroy
* @see app/Http/Controllers/FigureController.php:167
* @route '/projects/{project}/figures/{figure}'
*/
destroy.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/FigureController.php:167
* @route '/projects/{project}/figures/{figure}'
*/
destroy.delete = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FigureController::destroy
* @see app/Http/Controllers/FigureController.php:167
* @route '/projects/{project}/figures/{figure}'
*/
const destroyForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/FigureController.php:167
* @route '/projects/{project}/figures/{figure}'
*/
destroyForm.delete = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
export const exportTex = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportTex.url(args, options),
    method: 'get',
})

exportTex.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures/{figure}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
exportTex.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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

    return exportTex.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
exportTex.get = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportTex.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
exportTex.head = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportTex.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
const exportTexForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportTex.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
exportTexForm.get = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportTex.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureController::exportTex
* @see app/Http/Controllers/FigureController.php:204
* @route '/projects/{project}/figures/{figure}/export'
*/
exportTexForm.head = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportTex.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportTex.form = exportTexForm

/**
* @see \App\Http\Controllers\FigureController::restoreRevision
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
export const restoreRevision = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreRevision.url(args, options),
    method: 'post',
})

restoreRevision.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures/{figure}/revisions/{revision}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureController::restoreRevision
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
restoreRevision.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            figure: args[1],
            revision: args[2],
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
        revision: typeof args.revision === 'object'
        ? args.revision.public_id
        : args.revision,
    }

    return restoreRevision.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::restoreRevision
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
restoreRevision.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreRevision.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::restoreRevision
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
const restoreRevisionForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restoreRevision.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::restoreRevision
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
restoreRevisionForm.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restoreRevision.url(args, options),
    method: 'post',
})

restoreRevision.form = restoreRevisionForm

const FigureController = { index, store, insertIntoFile, show, update, destroy, exportTex, restoreRevision }

export default FigureController