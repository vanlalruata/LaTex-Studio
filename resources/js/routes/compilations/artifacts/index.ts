import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
export const show = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/compilations/{compilation}/artifacts/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
show.url = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            compilation: args[0],
            type: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        compilation: typeof args.compilation === 'object'
        ? args.compilation.public_id
        : args.compilation,
        type: args.type,
    }

    return show.definition.url
            .replace('{compilation}', parsedArgs.compilation.toString())
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
show.get = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
show.head = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
const showForm = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
showForm.get = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CompilationController::show
* @see app/Http/Controllers/CompilationController.php:231
* @route '/compilations/{compilation}/artifacts/{type}'
*/
showForm.head = (args: { compilation: string | number | { public_id: string | number }, type: string | number } | [compilation: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const artifacts = {
    show: Object.assign(show, show),
}

export default artifacts