import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectFileController::store
* @see app/Http/Controllers/ProjectFileController.php:39
* @route '/projects/{project}/files'
*/
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/files',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectFileController::store
* @see app/Http/Controllers/ProjectFileController.php:39
* @route '/projects/{project}/files'
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
* @see \App\Http\Controllers\ProjectFileController::store
* @see app/Http/Controllers/ProjectFileController.php:39
* @route '/projects/{project}/files'
*/
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectFileController::store
* @see app/Http/Controllers/ProjectFileController.php:39
* @route '/projects/{project}/files'
*/
const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectFileController::store
* @see app/Http/Controllers/ProjectFileController.php:39
* @route '/projects/{project}/files'
*/
storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
export const show = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/files/{file}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
show.url = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            file: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        file: typeof args.file === 'object'
        ? args.file.public_id
        : args.file,
    }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
show.get = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
show.head = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
const showForm = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
showForm.get = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectFileController::show
* @see app/Http/Controllers/ProjectFileController.php:19
* @route '/projects/{project}/files/{file}'
*/
showForm.head = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProjectFileController::update
* @see app/Http/Controllers/ProjectFileController.php:101
* @route '/projects/{project}/files/{file}'
*/
export const update = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/files/{file}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProjectFileController::update
* @see app/Http/Controllers/ProjectFileController.php:101
* @route '/projects/{project}/files/{file}'
*/
update.url = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            file: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        file: typeof args.file === 'object'
        ? args.file.public_id
        : args.file,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectFileController::update
* @see app/Http/Controllers/ProjectFileController.php:101
* @route '/projects/{project}/files/{file}'
*/
update.put = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProjectFileController::update
* @see app/Http/Controllers/ProjectFileController.php:101
* @route '/projects/{project}/files/{file}'
*/
const updateForm = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectFileController::update
* @see app/Http/Controllers/ProjectFileController.php:101
* @route '/projects/{project}/files/{file}'
*/
updateForm.put = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProjectFileController::destroy
* @see app/Http/Controllers/ProjectFileController.php:150
* @route '/projects/{project}/files/{file}'
*/
export const destroy = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/files/{file}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProjectFileController::destroy
* @see app/Http/Controllers/ProjectFileController.php:150
* @route '/projects/{project}/files/{file}'
*/
destroy.url = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            file: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        file: typeof args.file === 'object'
        ? args.file.public_id
        : args.file,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{file}', parsedArgs.file.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectFileController::destroy
* @see app/Http/Controllers/ProjectFileController.php:150
* @route '/projects/{project}/files/{file}'
*/
destroy.delete = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProjectFileController::destroy
* @see app/Http/Controllers/ProjectFileController.php:150
* @route '/projects/{project}/files/{file}'
*/
const destroyForm = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectFileController::destroy
* @see app/Http/Controllers/ProjectFileController.php:150
* @route '/projects/{project}/files/{file}'
*/
destroyForm.delete = (args: { project: string | { public_id: string }, file: string | { public_id: string } } | [project: string | { public_id: string }, file: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ProjectFileController = { store, show, update, destroy }

export default ProjectFileController