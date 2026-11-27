import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
export const redirect = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(args, options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/git/{provider}/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
redirect.url = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            provider: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        provider: args.provider,
    }

    return redirect.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
redirect.get = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
redirect.head = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
const redirectForm = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
redirectForm.get = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::redirect
* @see app/Http/Controllers/GitAuthController.php:15
* @route '/projects/{project}/git/{provider}/redirect'
*/
redirectForm.head = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirect.form = redirectForm

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
export const callback = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(args, options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/git/{provider}/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
callback.url = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: args.provider,
    }

    return callback.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
callback.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
callback.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
const callbackForm = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
callbackForm.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::callback
* @see app/Http/Controllers/GitAuthController.php:36
* @route '/git/{provider}/callback'
*/
callbackForm.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: callback.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

callback.form = callbackForm

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
export const repositories = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: repositories.url(args, options),
    method: 'get',
})

repositories.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/git/{provider}/repositories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
repositories.url = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            provider: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        provider: args.provider,
    }

    return repositories.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
repositories.get = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: repositories.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
repositories.head = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: repositories.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
const repositoriesForm = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: repositories.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
repositoriesForm.get = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: repositories.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\GitAuthController::repositories
* @see app/Http/Controllers/GitAuthController.php:77
* @route '/projects/{project}/git/{provider}/repositories'
*/
repositoriesForm.head = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: repositories.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

repositories.form = repositoriesForm

/**
* @see \App\Http\Controllers\GitAuthController::disconnect
* @see app/Http/Controllers/GitAuthController.php:95
* @route '/projects/{project}/git/{provider}/disconnect'
*/
export const disconnect = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnect.url(args, options),
    method: 'delete',
})

disconnect.definition = {
    methods: ["delete"],
    url: '/projects/{project}/git/{provider}/disconnect',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GitAuthController::disconnect
* @see app/Http/Controllers/GitAuthController.php:95
* @route '/projects/{project}/git/{provider}/disconnect'
*/
disconnect.url = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            provider: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        provider: args.provider,
    }

    return disconnect.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitAuthController::disconnect
* @see app/Http/Controllers/GitAuthController.php:95
* @route '/projects/{project}/git/{provider}/disconnect'
*/
disconnect.delete = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: disconnect.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\GitAuthController::disconnect
* @see app/Http/Controllers/GitAuthController.php:95
* @route '/projects/{project}/git/{provider}/disconnect'
*/
const disconnectForm = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: disconnect.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitAuthController::disconnect
* @see app/Http/Controllers/GitAuthController.php:95
* @route '/projects/{project}/git/{provider}/disconnect'
*/
disconnectForm.delete = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: disconnect.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

disconnect.form = disconnectForm

const GitAuthController = { redirect, callback, repositories, disconnect }

export default GitAuthController