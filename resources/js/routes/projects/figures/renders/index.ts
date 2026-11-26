import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FigureRenderController::store
 * @see app/Http/Controllers/FigureRenderController.php:19
 * @route '/projects/{project}/figures/{figure}/renders'
 */
export const store = (args: { project: string | { public_id: string }, figure: string | { public_id: string } } | [project: string | { public_id: string }, figure: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures/{figure}/renders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureRenderController::store
 * @see app/Http/Controllers/FigureRenderController.php:19
 * @route '/projects/{project}/figures/{figure}/renders'
 */
store.url = (args: { project: string | { public_id: string }, figure: string | { public_id: string } } | [project: string | { public_id: string }, figure: string | { public_id: string } ], options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\FigureRenderController::store
 * @see app/Http/Controllers/FigureRenderController.php:19
 * @route '/projects/{project}/figures/{figure}/renders'
 */
store.post = (args: { project: string | { public_id: string }, figure: string | { public_id: string } } | [project: string | { public_id: string }, figure: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FigureRenderController::store
 * @see app/Http/Controllers/FigureRenderController.php:19
 * @route '/projects/{project}/figures/{figure}/renders'
 */
    const storeForm = (args: { project: string | { public_id: string }, figure: string | { public_id: string } } | [project: string | { public_id: string }, figure: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FigureRenderController::store
 * @see app/Http/Controllers/FigureRenderController.php:19
 * @route '/projects/{project}/figures/{figure}/renders'
 */
        storeForm.post = (args: { project: string | { public_id: string }, figure: string | { public_id: string } } | [project: string | { public_id: string }, figure: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
export const show = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures/{figure}/renders/{renderJob}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
show.url = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    figure: args[1],
                    renderJob: args[2],
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
                                renderJob: typeof args.renderJob === 'object'
                ? args.renderJob.public_id
                : args.renderJob,
                }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace('{renderJob}', parsedArgs.renderJob.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
show.get = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
show.head = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
    const showForm = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
        showForm.get = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FigureRenderController::show
 * @see app/Http/Controllers/FigureRenderController.php:45
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}'
 */
        showForm.head = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
export const artifact = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artifact.url(args, options),
    method: 'get',
})

artifact.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
artifact.url = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    figure: args[1],
                    renderJob: args[2],
                    type: args[3],
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
                                renderJob: typeof args.renderJob === 'object'
                ? args.renderJob.public_id
                : args.renderJob,
                                type: args.type,
                }

    return artifact.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace('{renderJob}', parsedArgs.renderJob.toString())
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
artifact.get = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: artifact.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
artifact.head = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: artifact.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
    const artifactForm = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: artifact.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
        artifactForm.get = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artifact.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FigureRenderController::artifact
 * @see app/Http/Controllers/FigureRenderController.php:59
 * @route '/projects/{project}/figures/{figure}/renders/{renderJob}/artifacts/{type}'
 */
        artifactForm.head = (args: { project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number } | [project: string | { public_id: string }, figure: string | { public_id: string }, renderJob: string | number | { public_id: string | number }, type: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: artifact.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    artifact.form = artifactForm
const renders = {
    store: Object.assign(store, store),
show: Object.assign(show, show),
artifact: Object.assign(artifact, artifact),
}

export default renders