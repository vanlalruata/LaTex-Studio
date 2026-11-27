import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EquationController::index
* @see app/Http/Controllers/EquationController.php:33
* @route '/projects/{project}/equations'
*/
export const index = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EquationController::index
* @see app/Http/Controllers/EquationController.php:33
* @route '/projects/{project}/equations'
*/
index.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::index
* @see app/Http/Controllers/EquationController.php:33
* @route '/projects/{project}/equations'
*/
index.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EquationController::index
* @see app/Http/Controllers/EquationController.php:33
* @route '/projects/{project}/equations'
*/
const indexForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::index
* @see app/Http/Controllers/EquationController.php:33
* @route '/projects/{project}/equations'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::index
* @see app/Http/Controllers/EquationController.php:33
* @route '/projects/{project}/equations'
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
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:103
* @route '/projects/{project}/equations'
*/
export const store = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:103
* @route '/projects/{project}/equations'
*/
store.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:103
* @route '/projects/{project}/equations'
*/
const storeForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:103
* @route '/projects/{project}/equations'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EquationController::insertIntoFile
* @see app/Http/Controllers/EquationController.php:207
* @route '/projects/{project}/equations/insert'
*/
export const insertIntoFile = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insertIntoFile.url(args, options),
    method: 'post',
})

insertIntoFile.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/insert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::insertIntoFile
* @see app/Http/Controllers/EquationController.php:207
* @route '/projects/{project}/equations/insert'
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
* @see \App\Http\Controllers\EquationController::insertIntoFile
* @see app/Http/Controllers/EquationController.php:207
* @route '/projects/{project}/equations/insert'
*/
insertIntoFile.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insertIntoFile.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::insertIntoFile
* @see app/Http/Controllers/EquationController.php:207
* @route '/projects/{project}/equations/insert'
*/
const insertIntoFileForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: insertIntoFile.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::insertIntoFile
* @see app/Http/Controllers/EquationController.php:207
* @route '/projects/{project}/equations/insert'
*/
insertIntoFileForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: insertIntoFile.url(args, options),
    method: 'post',
})

insertIntoFile.form = insertIntoFileForm

/**
* @see \App\Http\Controllers\EquationController::show
* @see app/Http/Controllers/EquationController.php:71
* @route '/projects/{project}/equations/{equation}'
*/
export const show = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
show.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
show.get = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::show
* @see app/Http/Controllers/EquationController.php:71
* @route '/projects/{project}/equations/{equation}'
*/
show.head = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EquationController::show
* @see app/Http/Controllers/EquationController.php:71
* @route '/projects/{project}/equations/{equation}'
*/
const showForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::show
* @see app/Http/Controllers/EquationController.php:71
* @route '/projects/{project}/equations/{equation}'
*/
showForm.get = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::show
* @see app/Http/Controllers/EquationController.php:71
* @route '/projects/{project}/equations/{equation}'
*/
showForm.head = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
export const update = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
update.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
update.put = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EquationController::update
* @see app/Http/Controllers/EquationController.php:135
* @route '/projects/{project}/equations/{equation}'
*/
const updateForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
updateForm.put = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
export const destroy = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
destroy.delete = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EquationController::destroy
* @see app/Http/Controllers/EquationController.php:170
* @route '/projects/{project}/equations/{equation}'
*/
const destroyForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
destroyForm.delete = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EquationController::restoreRevision
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
export const restoreRevision = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreRevision.url(args, options),
    method: 'post',
})

restoreRevision.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/revisions/{revision}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::restoreRevision
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
restoreRevision.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            equation: args[1],
            revision: args[2],
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
        revision: typeof args.revision === 'object'
        ? args.revision.public_id
        : args.revision,
    }

    return restoreRevision.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::restoreRevision
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
restoreRevision.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreRevision.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::restoreRevision
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
const restoreRevisionForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restoreRevision.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::restoreRevision
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
restoreRevisionForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restoreRevision.url(args, options),
    method: 'post',
})

restoreRevision.form = restoreRevisionForm

/**
* @see \App\Http\Controllers\EquationController::compilePreview
* @see app/Http/Controllers/EquationController.php:269
* @route '/projects/{project}/equations/{equation}/compile-preview'
*/
export const compilePreview = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
compilePreview.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
compilePreview.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: compilePreview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::compilePreview
* @see app/Http/Controllers/EquationController.php:269
* @route '/projects/{project}/equations/{equation}/compile-preview'
*/
const compilePreviewForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: compilePreview.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::compilePreview
* @see app/Http/Controllers/EquationController.php:269
* @route '/projects/{project}/equations/{equation}/compile-preview'
*/
compilePreviewForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: compilePreview.url(args, options),
    method: 'post',
})

compilePreview.form = compilePreviewForm

/**
* @see \App\Http\Controllers\EquationController::previewPdf
* @see app/Http/Controllers/EquationController.php:337
* @route '/projects/{project}/equations/{equation}/preview.pdf'
*/
export const previewPdf = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
previewPdf.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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
previewPdf.get = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::previewPdf
* @see app/Http/Controllers/EquationController.php:337
* @route '/projects/{project}/equations/{equation}/preview.pdf'
*/
previewPdf.head = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EquationController::previewPdf
* @see app/Http/Controllers/EquationController.php:337
* @route '/projects/{project}/equations/{equation}/preview.pdf'
*/
const previewPdfForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: previewPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::previewPdf
* @see app/Http/Controllers/EquationController.php:337
* @route '/projects/{project}/equations/{equation}/preview.pdf'
*/
previewPdfForm.get = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: previewPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EquationController::previewPdf
* @see app/Http/Controllers/EquationController.php:337
* @route '/projects/{project}/equations/{equation}/preview.pdf'
*/
previewPdfForm.head = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: previewPdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

previewPdf.form = previewPdfForm

/**
* @see \App\Http\Controllers\EquationController::storeComment
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
export const storeComment = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

storeComment.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::storeComment
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
storeComment.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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

    return storeComment.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::storeComment
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
storeComment.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::storeComment
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
const storeCommentForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::storeComment
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
storeCommentForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeComment.url(args, options),
    method: 'post',
})

storeComment.form = storeCommentForm

/**
* @see \App\Http\Controllers\EquationController::toggleResolveComment
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
export const toggleResolveComment = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleResolveComment.url(args, options),
    method: 'post',
})

toggleResolveComment.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/comments/{comment}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::toggleResolveComment
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
toggleResolveComment.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            equation: args[1],
            comment: args[2],
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
        comment: typeof args.comment === 'object'
        ? args.comment.public_id
        : args.comment,
    }

    return toggleResolveComment.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::toggleResolveComment
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
toggleResolveComment.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleResolveComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::toggleResolveComment
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
const toggleResolveCommentForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleResolveComment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::toggleResolveComment
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
toggleResolveCommentForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleResolveComment.url(args, options),
    method: 'post',
})

toggleResolveComment.form = toggleResolveCommentForm

const EquationController = { index, store, insertIntoFile, show, update, destroy, restoreRevision, compilePreview, previewPdf, storeComment, toggleResolveComment }

export default EquationController