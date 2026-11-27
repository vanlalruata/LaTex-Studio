import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
*/
export const index = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
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
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
*/
index.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
*/
index.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
*/
const indexForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::index
* @see app/Http/Controllers/ProjectIntegrationController.php:18
* @route '/projects/{project}/integrations'
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
* @see \App\Http\Controllers\ProjectIntegrationController::store
* @see app/Http/Controllers/ProjectIntegrationController.php:32
* @route '/projects/{project}/integrations'
*/
export const store = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/integrations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectIntegrationController::store
* @see app/Http/Controllers/ProjectIntegrationController.php:32
* @route '/projects/{project}/integrations'
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
* @see \App\Http\Controllers\ProjectIntegrationController::store
* @see app/Http/Controllers/ProjectIntegrationController.php:32
* @route '/projects/{project}/integrations'
*/
store.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::store
* @see app/Http/Controllers/ProjectIntegrationController.php:32
* @route '/projects/{project}/integrations'
*/
const storeForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::store
* @see app/Http/Controllers/ProjectIntegrationController.php:32
* @route '/projects/{project}/integrations'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProjectIntegrationController::update
* @see app/Http/Controllers/ProjectIntegrationController.php:66
* @route '/projects/{project}/integrations/{integration}'
*/
export const update = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/projects/{project}/integrations/{integration}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProjectIntegrationController::update
* @see app/Http/Controllers/ProjectIntegrationController.php:66
* @route '/projects/{project}/integrations/{integration}'
*/
update.url = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            integration: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        integration: typeof args.integration === 'object'
        ? args.integration.public_id
        : args.integration,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIntegrationController::update
* @see app/Http/Controllers/ProjectIntegrationController.php:66
* @route '/projects/{project}/integrations/{integration}'
*/
update.patch = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::update
* @see app/Http/Controllers/ProjectIntegrationController.php:66
* @route '/projects/{project}/integrations/{integration}'
*/
const updateForm = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::update
* @see app/Http/Controllers/ProjectIntegrationController.php:66
* @route '/projects/{project}/integrations/{integration}'
*/
updateForm.patch = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ProjectIntegrationController::destroy
* @see app/Http/Controllers/ProjectIntegrationController.php:89
* @route '/projects/{project}/integrations/{integration}'
*/
export const destroy = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/integrations/{integration}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProjectIntegrationController::destroy
* @see app/Http/Controllers/ProjectIntegrationController.php:89
* @route '/projects/{project}/integrations/{integration}'
*/
destroy.url = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            integration: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        integration: typeof args.integration === 'object'
        ? args.integration.public_id
        : args.integration,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIntegrationController::destroy
* @see app/Http/Controllers/ProjectIntegrationController.php:89
* @route '/projects/{project}/integrations/{integration}'
*/
destroy.delete = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::destroy
* @see app/Http/Controllers/ProjectIntegrationController.php:89
* @route '/projects/{project}/integrations/{integration}'
*/
const destroyForm = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectIntegrationController::destroy
* @see app/Http/Controllers/ProjectIntegrationController.php:89
* @route '/projects/{project}/integrations/{integration}'
*/
destroyForm.delete = (args: { project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, integration: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const integrations = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default integrations