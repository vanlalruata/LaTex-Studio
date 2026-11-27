import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
*/
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/conversions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
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
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
*/
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
*/
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
*/
const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
*/
indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversionJobController::index
* @see app/Http/Controllers/ConversionJobController.php:14
* @route '/projects/{project}/conversions'
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
* @see \App\Http\Controllers\ConversionJobController::store
* @see app/Http/Controllers/ConversionJobController.php:29
* @route '/projects/{project}/conversions'
*/
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/conversions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConversionJobController::store
* @see app/Http/Controllers/ConversionJobController.php:29
* @route '/projects/{project}/conversions'
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
* @see \App\Http\Controllers\ConversionJobController::store
* @see app/Http/Controllers/ConversionJobController.php:29
* @route '/projects/{project}/conversions'
*/
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversionJobController::store
* @see app/Http/Controllers/ConversionJobController.php:29
* @route '/projects/{project}/conversions'
*/
const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversionJobController::store
* @see app/Http/Controllers/ConversionJobController.php:29
* @route '/projects/{project}/conversions'
*/
storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ConversionJobController::destroy
* @see app/Http/Controllers/ConversionJobController.php:52
* @route '/projects/{project}/conversions/{conversionJob}'
*/
export const destroy = (args: { project: string | { public_id: string }, conversionJob: string | { public_id: string } } | [project: string | { public_id: string }, conversionJob: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/conversions/{conversionJob}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ConversionJobController::destroy
* @see app/Http/Controllers/ConversionJobController.php:52
* @route '/projects/{project}/conversions/{conversionJob}'
*/
destroy.url = (args: { project: string | { public_id: string }, conversionJob: string | { public_id: string } } | [project: string | { public_id: string }, conversionJob: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            conversionJob: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        conversionJob: typeof args.conversionJob === 'object'
        ? args.conversionJob.public_id
        : args.conversionJob,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{conversionJob}', parsedArgs.conversionJob.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversionJobController::destroy
* @see app/Http/Controllers/ConversionJobController.php:52
* @route '/projects/{project}/conversions/{conversionJob}'
*/
destroy.delete = (args: { project: string | { public_id: string }, conversionJob: string | { public_id: string } } | [project: string | { public_id: string }, conversionJob: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ConversionJobController::destroy
* @see app/Http/Controllers/ConversionJobController.php:52
* @route '/projects/{project}/conversions/{conversionJob}'
*/
const destroyForm = (args: { project: string | { public_id: string }, conversionJob: string | { public_id: string } } | [project: string | { public_id: string }, conversionJob: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversionJobController::destroy
* @see app/Http/Controllers/ConversionJobController.php:52
* @route '/projects/{project}/conversions/{conversionJob}'
*/
destroyForm.delete = (args: { project: string | { public_id: string }, conversionJob: string | { public_id: string } } | [project: string | { public_id: string }, conversionJob: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const conversions = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default conversions