import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/milestones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
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
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProjectMilestoneController::index
 * @see app/Http/Controllers/ProjectMilestoneController.php:15
 * @route '/projects/{project}/milestones'
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
* @see \App\Http\Controllers\ProjectMilestoneController::store
 * @see app/Http/Controllers/ProjectMilestoneController.php:38
 * @route '/projects/{project}/milestones'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/milestones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectMilestoneController::store
 * @see app/Http/Controllers/ProjectMilestoneController.php:38
 * @route '/projects/{project}/milestones'
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
* @see \App\Http\Controllers\ProjectMilestoneController::store
 * @see app/Http/Controllers/ProjectMilestoneController.php:38
 * @route '/projects/{project}/milestones'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProjectMilestoneController::store
 * @see app/Http/Controllers/ProjectMilestoneController.php:38
 * @route '/projects/{project}/milestones'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectMilestoneController::store
 * @see app/Http/Controllers/ProjectMilestoneController.php:38
 * @route '/projects/{project}/milestones'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProjectMilestoneController::update
 * @see app/Http/Controllers/ProjectMilestoneController.php:75
 * @route '/projects/{project}/milestones/{milestone}'
 */
export const update = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/projects/{project}/milestones/{milestone}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProjectMilestoneController::update
 * @see app/Http/Controllers/ProjectMilestoneController.php:75
 * @route '/projects/{project}/milestones/{milestone}'
 */
update.url = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    milestone: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                milestone: typeof args.milestone === 'object'
                ? args.milestone.public_id
                : args.milestone,
                }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{milestone}', parsedArgs.milestone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectMilestoneController::update
 * @see app/Http/Controllers/ProjectMilestoneController.php:75
 * @route '/projects/{project}/milestones/{milestone}'
 */
update.patch = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProjectMilestoneController::update
 * @see app/Http/Controllers/ProjectMilestoneController.php:75
 * @route '/projects/{project}/milestones/{milestone}'
 */
    const updateForm = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectMilestoneController::update
 * @see app/Http/Controllers/ProjectMilestoneController.php:75
 * @route '/projects/{project}/milestones/{milestone}'
 */
        updateForm.patch = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProjectMilestoneController::destroy
 * @see app/Http/Controllers/ProjectMilestoneController.php:112
 * @route '/projects/{project}/milestones/{milestone}'
 */
export const destroy = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/milestones/{milestone}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProjectMilestoneController::destroy
 * @see app/Http/Controllers/ProjectMilestoneController.php:112
 * @route '/projects/{project}/milestones/{milestone}'
 */
destroy.url = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    milestone: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                milestone: typeof args.milestone === 'object'
                ? args.milestone.public_id
                : args.milestone,
                }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{milestone}', parsedArgs.milestone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectMilestoneController::destroy
 * @see app/Http/Controllers/ProjectMilestoneController.php:112
 * @route '/projects/{project}/milestones/{milestone}'
 */
destroy.delete = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProjectMilestoneController::destroy
 * @see app/Http/Controllers/ProjectMilestoneController.php:112
 * @route '/projects/{project}/milestones/{milestone}'
 */
    const destroyForm = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectMilestoneController::destroy
 * @see app/Http/Controllers/ProjectMilestoneController.php:112
 * @route '/projects/{project}/milestones/{milestone}'
 */
        destroyForm.delete = (args: { project: string | { public_id: string }, milestone: string | { public_id: string } } | [project: string | { public_id: string }, milestone: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProjectMilestoneController = { index, store, update, destroy }

export default ProjectMilestoneController