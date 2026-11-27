import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
*/
export const index = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/comments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
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
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
*/
index.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
*/
index.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
*/
const indexForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:15
* @route '/projects/{project}/comments'
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
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:44
* @route '/projects/{project}/comments'
*/
export const store = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:44
* @route '/projects/{project}/comments'
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
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:44
* @route '/projects/{project}/comments'
*/
store.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:44
* @route '/projects/{project}/comments'
*/
const storeForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:44
* @route '/projects/{project}/comments'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CommentController::reply
* @see app/Http/Controllers/CommentController.php:86
* @route '/projects/{project}/comments/{thread}/reply'
*/
export const reply = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reply.url(args, options),
    method: 'post',
})

reply.definition = {
    methods: ["post"],
    url: '/projects/{project}/comments/{thread}/reply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::reply
* @see app/Http/Controllers/CommentController.php:86
* @route '/projects/{project}/comments/{thread}/reply'
*/
reply.url = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            thread: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        thread: typeof args.thread === 'object'
        ? args.thread.public_id
        : args.thread,
    }

    return reply.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{thread}', parsedArgs.thread.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::reply
* @see app/Http/Controllers/CommentController.php:86
* @route '/projects/{project}/comments/{thread}/reply'
*/
reply.post = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::reply
* @see app/Http/Controllers/CommentController.php:86
* @route '/projects/{project}/comments/{thread}/reply'
*/
const replyForm = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reply.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::reply
* @see app/Http/Controllers/CommentController.php:86
* @route '/projects/{project}/comments/{thread}/reply'
*/
replyForm.post = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reply.url(args, options),
    method: 'post',
})

reply.form = replyForm

/**
* @see \App\Http\Controllers\CommentController::resolve
* @see app/Http/Controllers/CommentController.php:112
* @route '/projects/{project}/comments/{thread}/resolve'
*/
export const resolve = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/projects/{project}/comments/{thread}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::resolve
* @see app/Http/Controllers/CommentController.php:112
* @route '/projects/{project}/comments/{thread}/resolve'
*/
resolve.url = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            thread: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        thread: typeof args.thread === 'object'
        ? args.thread.public_id
        : args.thread,
    }

    return resolve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{thread}', parsedArgs.thread.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::resolve
* @see app/Http/Controllers/CommentController.php:112
* @route '/projects/{project}/comments/{thread}/resolve'
*/
resolve.post = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::resolve
* @see app/Http/Controllers/CommentController.php:112
* @route '/projects/{project}/comments/{thread}/resolve'
*/
const resolveForm = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::resolve
* @see app/Http/Controllers/CommentController.php:112
* @route '/projects/{project}/comments/{thread}/resolve'
*/
resolveForm.post = (args: { project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, thread: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

resolve.form = resolveForm

const CommentController = { index, store, reply, resolve }

export default CommentController