import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/build-queue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::index
* @see app/Http/Controllers/Admin/BuildQueueController.php:18
* @route '/admin/build-queue'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::cancel
* @see app/Http/Controllers/Admin/BuildQueueController.php:30
* @route '/admin/build-queue/{compilation}/cancel'
*/
export const cancel = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/build-queue/{compilation}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::cancel
* @see app/Http/Controllers/Admin/BuildQueueController.php:30
* @route '/admin/build-queue/{compilation}/cancel'
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
* @see \App\Http\Controllers\Admin\BuildQueueController::cancel
* @see app/Http/Controllers/Admin/BuildQueueController.php:30
* @route '/admin/build-queue/{compilation}/cancel'
*/
cancel.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::cancel
* @see app/Http/Controllers/Admin/BuildQueueController.php:30
* @route '/admin/build-queue/{compilation}/cancel'
*/
const cancelForm = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BuildQueueController::cancel
* @see app/Http/Controllers/Admin/BuildQueueController.php:30
* @route '/admin/build-queue/{compilation}/cancel'
*/
cancelForm.post = (args: { compilation: string | { public_id: string } } | [compilation: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

cancel.form = cancelForm

const buildQueue = {
    index: Object.assign(index, index),
    cancel: Object.assign(cancel, cancel),
}

export default buildQueue