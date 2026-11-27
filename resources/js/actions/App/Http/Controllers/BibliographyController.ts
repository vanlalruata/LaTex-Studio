import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
*/
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/bibliography',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
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
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
*/
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
*/
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
*/
const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
*/
indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliographyController::index
* @see app/Http/Controllers/BibliographyController.php:17
* @route '/projects/{project}/bibliography'
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
* @see \App\Http\Controllers\BibliographyController::store
* @see app/Http/Controllers/BibliographyController.php:42
* @route '/projects/{project}/bibliography'
*/
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/bibliography',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BibliographyController::store
* @see app/Http/Controllers/BibliographyController.php:42
* @route '/projects/{project}/bibliography'
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
* @see \App\Http\Controllers\BibliographyController::store
* @see app/Http/Controllers/BibliographyController.php:42
* @route '/projects/{project}/bibliography'
*/
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyController::store
* @see app/Http/Controllers/BibliographyController.php:42
* @route '/projects/{project}/bibliography'
*/
const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyController::store
* @see app/Http/Controllers/BibliographyController.php:42
* @route '/projects/{project}/bibliography'
*/
storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BibliographyController::importBib
* @see app/Http/Controllers/BibliographyController.php:99
* @route '/projects/{project}/bibliography/import'
*/
export const importBib = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importBib.url(args, options),
    method: 'post',
})

importBib.definition = {
    methods: ["post"],
    url: '/projects/{project}/bibliography/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BibliographyController::importBib
* @see app/Http/Controllers/BibliographyController.php:99
* @route '/projects/{project}/bibliography/import'
*/
importBib.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return importBib.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BibliographyController::importBib
* @see app/Http/Controllers/BibliographyController.php:99
* @route '/projects/{project}/bibliography/import'
*/
importBib.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importBib.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyController::importBib
* @see app/Http/Controllers/BibliographyController.php:99
* @route '/projects/{project}/bibliography/import'
*/
const importBibForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importBib.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyController::importBib
* @see app/Http/Controllers/BibliographyController.php:99
* @route '/projects/{project}/bibliography/import'
*/
importBibForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importBib.url(args, options),
    method: 'post',
})

importBib.form = importBibForm

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
export const exportBib = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportBib.url(args, options),
    method: 'get',
})

exportBib.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/bibliography/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
exportBib.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return exportBib.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
exportBib.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportBib.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
exportBib.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportBib.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
const exportBibForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportBib.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
exportBibForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportBib.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BibliographyController::exportBib
* @see app/Http/Controllers/BibliographyController.php:143
* @route '/projects/{project}/bibliography/export'
*/
exportBibForm.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportBib.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportBib.form = exportBibForm

/**
* @see \App\Http\Controllers\BibliographyController::destroy
* @see app/Http/Controllers/BibliographyController.php:89
* @route '/projects/{project}/bibliography/{source}'
*/
export const destroy = (args: { project: string | { public_id: string }, source: string | { public_id: string } } | [project: string | { public_id: string }, source: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/bibliography/{source}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BibliographyController::destroy
* @see app/Http/Controllers/BibliographyController.php:89
* @route '/projects/{project}/bibliography/{source}'
*/
destroy.url = (args: { project: string | { public_id: string }, source: string | { public_id: string } } | [project: string | { public_id: string }, source: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            source: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        source: typeof args.source === 'object'
        ? args.source.public_id
        : args.source,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BibliographyController::destroy
* @see app/Http/Controllers/BibliographyController.php:89
* @route '/projects/{project}/bibliography/{source}'
*/
destroy.delete = (args: { project: string | { public_id: string }, source: string | { public_id: string } } | [project: string | { public_id: string }, source: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BibliographyController::destroy
* @see app/Http/Controllers/BibliographyController.php:89
* @route '/projects/{project}/bibliography/{source}'
*/
const destroyForm = (args: { project: string | { public_id: string }, source: string | { public_id: string } } | [project: string | { public_id: string }, source: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyController::destroy
* @see app/Http/Controllers/BibliographyController.php:89
* @route '/projects/{project}/bibliography/{source}'
*/
destroyForm.delete = (args: { project: string | { public_id: string }, source: string | { public_id: string } } | [project: string | { public_id: string }, source: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const BibliographyController = { index, store, importBib, exportBib, destroy }

export default BibliographyController