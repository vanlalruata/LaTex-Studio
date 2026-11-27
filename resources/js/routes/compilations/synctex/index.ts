import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CompilationController::forward
* @see app/Http/Controllers/CompilationController.php:158
* @route '/compilations/{compilation}/synctex/forward'
*/
export const forward = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forward.url(args, options),
    method: 'post',
})

forward.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/synctex/forward',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::forward
* @see app/Http/Controllers/CompilationController.php:158
* @route '/compilations/{compilation}/synctex/forward'
*/
forward.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return forward.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::forward
* @see app/Http/Controllers/CompilationController.php:158
* @route '/compilations/{compilation}/synctex/forward'
*/
forward.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forward.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::forward
* @see app/Http/Controllers/CompilationController.php:158
* @route '/compilations/{compilation}/synctex/forward'
*/
const forwardForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forward.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::forward
* @see app/Http/Controllers/CompilationController.php:158
* @route '/compilations/{compilation}/synctex/forward'
*/
forwardForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forward.url(args, options),
    method: 'post',
})

forward.form = forwardForm

/**
* @see \App\Http\Controllers\CompilationController::inverse
* @see app/Http/Controllers/CompilationController.php:194
* @route '/compilations/{compilation}/synctex/inverse'
*/
export const inverse = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inverse.url(args, options),
    method: 'post',
})

inverse.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/synctex/inverse',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::inverse
* @see app/Http/Controllers/CompilationController.php:194
* @route '/compilations/{compilation}/synctex/inverse'
*/
inverse.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return inverse.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::inverse
* @see app/Http/Controllers/CompilationController.php:194
* @route '/compilations/{compilation}/synctex/inverse'
*/
inverse.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: inverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::inverse
* @see app/Http/Controllers/CompilationController.php:194
* @route '/compilations/{compilation}/synctex/inverse'
*/
const inverseForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: inverse.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::inverse
* @see app/Http/Controllers/CompilationController.php:194
* @route '/compilations/{compilation}/synctex/inverse'
*/
inverseForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: inverse.url(args, options),
    method: 'post',
})

inverse.form = inverseForm

const synctex = {
    forward: Object.assign(forward, forward),
    inverse: Object.assign(inverse, inverse),
}

export default synctex