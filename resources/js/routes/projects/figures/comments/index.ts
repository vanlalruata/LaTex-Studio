import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
export const index = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures/{figure}/comments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
index.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
index.get = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
index.head = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
const indexForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FigureCommentController::index
* @see app/Http/Controllers/FigureCommentController.php:14
* @route '/projects/{project}/figures/{figure}/comments'
*/
indexForm.head = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FigureCommentController::store
* @see app/Http/Controllers/FigureCommentController.php:29
* @route '/projects/{project}/figures/{figure}/comments'
*/
export const store = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures/{figure}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureCommentController::store
* @see app/Http/Controllers/FigureCommentController.php:29
* @route '/projects/{project}/figures/{figure}/comments'
*/
store.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureCommentController::store
* @see app/Http/Controllers/FigureCommentController.php:29
* @route '/projects/{project}/figures/{figure}/comments'
*/
store.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureCommentController::store
* @see app/Http/Controllers/FigureCommentController.php:29
* @route '/projects/{project}/figures/{figure}/comments'
*/
const storeForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureCommentController::store
* @see app/Http/Controllers/FigureCommentController.php:29
* @route '/projects/{project}/figures/{figure}/comments'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FigureCommentController::resolve
* @see app/Http/Controllers/FigureCommentController.php:58
* @route '/projects/{project}/figures/{figure}/comments/{comment}/resolve'
*/
export const resolve = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures/{figure}/comments/{comment}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureCommentController::resolve
* @see app/Http/Controllers/FigureCommentController.php:58
* @route '/projects/{project}/figures/{figure}/comments/{comment}/resolve'
*/
resolve.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            figure: args[1],
            comment: args[2],
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
        comment: typeof args.comment === 'object'
        ? args.comment.public_id
        : args.comment,
    }

    return resolve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureCommentController::resolve
* @see app/Http/Controllers/FigureCommentController.php:58
* @route '/projects/{project}/figures/{figure}/comments/{comment}/resolve'
*/
resolve.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureCommentController::resolve
* @see app/Http/Controllers/FigureCommentController.php:58
* @route '/projects/{project}/figures/{figure}/comments/{comment}/resolve'
*/
const resolveForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureCommentController::resolve
* @see app/Http/Controllers/FigureCommentController.php:58
* @route '/projects/{project}/figures/{figure}/comments/{comment}/resolve'
*/
resolveForm.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

resolve.form = resolveForm

const comments = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    resolve: Object.assign(resolve, resolve),
}

export default comments