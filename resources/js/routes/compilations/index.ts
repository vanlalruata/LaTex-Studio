import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import synctex from './synctex'
import artifacts from './artifacts'
/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
export const show = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/compilations/{compilation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
show.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
show.get = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
show.head = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
const showForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
showForm.get = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:48
* @route '/compilations/{compilation}'
*/
showForm.head = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CompilationController::cancel
* @see app/Http/Controllers/CompilationController.php:80
* @route '/compilations/{compilation}/cancel'
*/
export const cancel = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::cancel
* @see app/Http/Controllers/CompilationController.php:80
* @route '/compilations/{compilation}/cancel'
*/
cancel.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::cancel
* @see app/Http/Controllers/CompilationController.php:80
* @route '/compilations/{compilation}/cancel'
*/
cancel.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::cancel
* @see app/Http/Controllers/CompilationController.php:80
* @route '/compilations/{compilation}/cancel'
*/
const cancelForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::cancel
* @see app/Http/Controllers/CompilationController.php:80
* @route '/compilations/{compilation}/cancel'
*/
cancelForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

cancel.form = cancelForm

/**
* @see \App\Http\Controllers\CompilationController::retry
* @see app/Http/Controllers/CompilationController.php:102
* @route '/compilations/{compilation}/retry'
*/
export const retry = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/compilations/{compilation}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompilationController::retry
* @see app/Http/Controllers/CompilationController.php:102
* @route '/compilations/{compilation}/retry'
*/
retry.url = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return retry.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::retry
* @see app/Http/Controllers/CompilationController.php:102
* @route '/compilations/{compilation}/retry'
*/
retry.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::retry
* @see app/Http/Controllers/CompilationController.php:102
* @route '/compilations/{compilation}/retry'
*/
const retryForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CompilationController::retry
* @see app/Http/Controllers/CompilationController.php:102
* @route '/compilations/{compilation}/retry'
*/
retryForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

retry.form = retryForm

const compilations = {
    show: Object.assign(show, show),
    cancel: Object.assign(cancel, cancel),
    retry: Object.assign(retry, retry),
    synctex: Object.assign(synctex, synctex),
    artifacts: Object.assign(artifacts, artifacts),
}

export default compilations