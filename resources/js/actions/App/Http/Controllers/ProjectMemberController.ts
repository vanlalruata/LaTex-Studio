import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
 */
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
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
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
 */
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
 */
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
 */
    const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
 */
        indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProjectMemberController::index
 * @see app/Http/Controllers/ProjectMemberController.php:17
 * @route '/projects/{project}/members'
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
* @see \App\Http\Controllers\ProjectMemberController::store
 * @see app/Http/Controllers/ProjectMemberController.php:41
 * @route '/projects/{project}/members'
 */
export const store = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectMemberController::store
 * @see app/Http/Controllers/ProjectMemberController.php:41
 * @route '/projects/{project}/members'
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
* @see \App\Http\Controllers\ProjectMemberController::store
 * @see app/Http/Controllers/ProjectMemberController.php:41
 * @route '/projects/{project}/members'
 */
store.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProjectMemberController::store
 * @see app/Http/Controllers/ProjectMemberController.php:41
 * @route '/projects/{project}/members'
 */
    const storeForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectMemberController::store
 * @see app/Http/Controllers/ProjectMemberController.php:41
 * @route '/projects/{project}/members'
 */
        storeForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProjectMemberController::destroy
 * @see app/Http/Controllers/ProjectMemberController.php:79
 * @route '/projects/{project}/members/{member}'
 */
export const destroy = (args: { project: string | { public_id: string }, member: number | { id: number } } | [project: string | { public_id: string }, member: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/members/{member}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProjectMemberController::destroy
 * @see app/Http/Controllers/ProjectMemberController.php:79
 * @route '/projects/{project}/members/{member}'
 */
destroy.url = (args: { project: string | { public_id: string }, member: number | { id: number } } | [project: string | { public_id: string }, member: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    project: args[0],
                    member: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        project: typeof args.project === 'object'
                ? args.project.public_id
                : args.project,
                                member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectMemberController::destroy
 * @see app/Http/Controllers/ProjectMemberController.php:79
 * @route '/projects/{project}/members/{member}'
 */
destroy.delete = (args: { project: string | { public_id: string }, member: number | { id: number } } | [project: string | { public_id: string }, member: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProjectMemberController::destroy
 * @see app/Http/Controllers/ProjectMemberController.php:79
 * @route '/projects/{project}/members/{member}'
 */
    const destroyForm = (args: { project: string | { public_id: string }, member: number | { id: number } } | [project: string | { public_id: string }, member: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProjectMemberController::destroy
 * @see app/Http/Controllers/ProjectMemberController.php:79
 * @route '/projects/{project}/members/{member}'
 */
        destroyForm.delete = (args: { project: string | { public_id: string }, member: number | { id: number } } | [project: string | { public_id: string }, member: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProjectMemberController = { index, store, destroy }

export default ProjectMemberController