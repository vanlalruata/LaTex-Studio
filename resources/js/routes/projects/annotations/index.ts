import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
*/
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/annotations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
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
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
*/
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
*/
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
*/
const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
*/
indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnnotationController::index
* @see app/Http/Controllers/AnnotationController.php:15
* @route '/projects/{project}/annotations'
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
* @see \App\Http\Controllers\AnnotationController::store
* @see app/Http/Controllers/AnnotationController.php:39
* @route '/projects/{project}/annotations'
*/
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/annotations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnnotationController::store
* @see app/Http/Controllers/AnnotationController.php:39
* @route '/projects/{project}/annotations'
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
* @see \App\Http\Controllers\AnnotationController::store
* @see app/Http/Controllers/AnnotationController.php:39
* @route '/projects/{project}/annotations'
*/
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnnotationController::store
* @see app/Http/Controllers/AnnotationController.php:39
* @route '/projects/{project}/annotations'
*/
const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnnotationController::store
* @see app/Http/Controllers/AnnotationController.php:39
* @route '/projects/{project}/annotations'
*/
storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AnnotationController::update
* @see app/Http/Controllers/AnnotationController.php:76
* @route '/projects/{project}/annotations/{annotation}'
*/
export const update = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/projects/{project}/annotations/{annotation}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AnnotationController::update
* @see app/Http/Controllers/AnnotationController.php:76
* @route '/projects/{project}/annotations/{annotation}'
*/
update.url = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            annotation: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        annotation: typeof args.annotation === 'object'
        ? args.annotation.public_id
        : args.annotation,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{annotation}', parsedArgs.annotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnnotationController::update
* @see app/Http/Controllers/AnnotationController.php:76
* @route '/projects/{project}/annotations/{annotation}'
*/
update.patch = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\AnnotationController::update
* @see app/Http/Controllers/AnnotationController.php:76
* @route '/projects/{project}/annotations/{annotation}'
*/
const updateForm = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnnotationController::update
* @see app/Http/Controllers/AnnotationController.php:76
* @route '/projects/{project}/annotations/{annotation}'
*/
updateForm.patch = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AnnotationController::destroy
* @see app/Http/Controllers/AnnotationController.php:98
* @route '/projects/{project}/annotations/{annotation}'
*/
export const destroy = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/annotations/{annotation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AnnotationController::destroy
* @see app/Http/Controllers/AnnotationController.php:98
* @route '/projects/{project}/annotations/{annotation}'
*/
destroy.url = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            annotation: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        annotation: typeof args.annotation === 'object'
        ? args.annotation.public_id
        : args.annotation,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{annotation}', parsedArgs.annotation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnnotationController::destroy
* @see app/Http/Controllers/AnnotationController.php:98
* @route '/projects/{project}/annotations/{annotation}'
*/
destroy.delete = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AnnotationController::destroy
* @see app/Http/Controllers/AnnotationController.php:98
* @route '/projects/{project}/annotations/{annotation}'
*/
const destroyForm = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnnotationController::destroy
* @see app/Http/Controllers/AnnotationController.php:98
* @route '/projects/{project}/annotations/{annotation}'
*/
destroyForm.delete = (args: { project: string | { public_id: string }, annotation: string | { public_id: string } } | [project: string | { public_id: string }, annotation: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const annotations = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default annotations