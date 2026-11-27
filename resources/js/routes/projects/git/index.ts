import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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

/**
* @see \App\Http\Controllers\GitSyncController::push
* @see app/Http/Controllers/GitSyncController.php:14
* @route '/projects/{project}/git/{provider}/push'
*/
export const push = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: push.url(args, options),
    method: 'post',
})

push.definition = {
    methods: ["post"],
    url: '/projects/{project}/git/{provider}/push',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GitSyncController::push
* @see app/Http/Controllers/GitSyncController.php:14
* @route '/projects/{project}/git/{provider}/push'
*/
push.url = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions) => {
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

    return push.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitSyncController::push
* @see app/Http/Controllers/GitSyncController.php:14
* @route '/projects/{project}/git/{provider}/push'
*/
push.post = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: push.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitSyncController::push
* @see app/Http/Controllers/GitSyncController.php:14
* @route '/projects/{project}/git/{provider}/push'
*/
const pushForm = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: push.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitSyncController::push
* @see app/Http/Controllers/GitSyncController.php:14
* @route '/projects/{project}/git/{provider}/push'
*/
pushForm.post = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: push.url(args, options),
    method: 'post',
})

push.form = pushForm

/**
* @see \App\Http\Controllers\GitSyncController::pull
* @see app/Http/Controllers/GitSyncController.php:40
* @route '/projects/{project}/git/{provider}/pull'
*/
export const pull = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pull.url(args, options),
    method: 'post',
})

pull.definition = {
    methods: ["post"],
    url: '/projects/{project}/git/{provider}/pull',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GitSyncController::pull
* @see app/Http/Controllers/GitSyncController.php:40
* @route '/projects/{project}/git/{provider}/pull'
*/
pull.url = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions) => {
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

    return pull.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitSyncController::pull
* @see app/Http/Controllers/GitSyncController.php:40
* @route '/projects/{project}/git/{provider}/pull'
*/
pull.post = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pull.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitSyncController::pull
* @see app/Http/Controllers/GitSyncController.php:40
* @route '/projects/{project}/git/{provider}/pull'
*/
const pullForm = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pull.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitSyncController::pull
* @see app/Http/Controllers/GitSyncController.php:40
* @route '/projects/{project}/git/{provider}/pull'
*/
pullForm.post = (args: { project: string | { public_id: string }, provider: string | number } | [project: string | { public_id: string }, provider: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pull.url(args, options),
    method: 'post',
})

pull.form = pullForm

const git = {
    redirect: Object.assign(redirect, redirect),
    repositories: Object.assign(repositories, repositories),
    disconnect: Object.assign(disconnect, disconnect),
    push: Object.assign(push, push),
    pull: Object.assign(pull, pull),
}

export default git