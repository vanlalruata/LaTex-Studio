import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
*/
export const index = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/ocr',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
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
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
*/
index.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
*/
index.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
*/
const indexForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OcrJobController::index
* @see app/Http/Controllers/OcrJobController.php:14
* @route '/projects/{project}/ocr'
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
* @see \App\Http\Controllers\OcrJobController::store
* @see app/Http/Controllers/OcrJobController.php:29
* @route '/projects/{project}/ocr'
*/
export const store = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/ocr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OcrJobController::store
* @see app/Http/Controllers/OcrJobController.php:29
* @route '/projects/{project}/ocr'
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
* @see \App\Http\Controllers\OcrJobController::store
* @see app/Http/Controllers/OcrJobController.php:29
* @route '/projects/{project}/ocr'
*/
store.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OcrJobController::store
* @see app/Http/Controllers/OcrJobController.php:29
* @route '/projects/{project}/ocr'
*/
const storeForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OcrJobController::store
* @see app/Http/Controllers/OcrJobController.php:29
* @route '/projects/{project}/ocr'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\OcrJobController::destroy
* @see app/Http/Controllers/OcrJobController.php:52
* @route '/projects/{project}/ocr/{ocrJob}'
*/
export const destroy = (args: { project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/ocr/{ocrJob}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OcrJobController::destroy
* @see app/Http/Controllers/OcrJobController.php:52
* @route '/projects/{project}/ocr/{ocrJob}'
*/
destroy.url = (args: { project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            ocrJob: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        ocrJob: typeof args.ocrJob === 'object'
        ? args.ocrJob.public_id
        : args.ocrJob,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{ocrJob}', parsedArgs.ocrJob.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OcrJobController::destroy
* @see app/Http/Controllers/OcrJobController.php:52
* @route '/projects/{project}/ocr/{ocrJob}'
*/
destroy.delete = (args: { project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\OcrJobController::destroy
* @see app/Http/Controllers/OcrJobController.php:52
* @route '/projects/{project}/ocr/{ocrJob}'
*/
const destroyForm = (args: { project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OcrJobController::destroy
* @see app/Http/Controllers/OcrJobController.php:52
* @route '/projects/{project}/ocr/{ocrJob}'
*/
destroyForm.delete = (args: { project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, ocrJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const OcrJobController = { index, store, destroy }

export default OcrJobController