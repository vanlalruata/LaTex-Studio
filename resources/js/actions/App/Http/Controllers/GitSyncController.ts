import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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

const GitSyncController = { push, pull }

export default GitSyncController