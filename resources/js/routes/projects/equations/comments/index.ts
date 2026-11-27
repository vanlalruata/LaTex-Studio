import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
export const store = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
store.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
store.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
const storeForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::store
* @see app/Http/Controllers/EquationController.php:354
* @route '/projects/{project}/equations/{equation}/comments'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EquationController::resolve
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
export const resolve = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

resolve.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/comments/{comment}/resolve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::resolve
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
resolve.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
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

    return resolve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::resolve
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
resolve.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::resolve
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
const resolveForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::resolve
* @see app/Http/Controllers/EquationController.php:379
* @route '/projects/{project}/equations/{equation}/comments/{comment}/resolve'
*/
resolveForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, comment: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, options),
    method: 'post',
})

resolve.form = resolveForm

const comments = {
    store: Object.assign(store, store),
    resolve: Object.assign(resolve, resolve),
}

export default comments