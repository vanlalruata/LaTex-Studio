import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
*/
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/ai',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
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
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
*/
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
*/
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
*/
const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
*/
indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AiAssistantController::index
* @see app/Http/Controllers/AiAssistantController.php:21
* @route '/projects/{project}/ai'
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
* @see \App\Http\Controllers\AiAssistantController::ask
* @see app/Http/Controllers/AiAssistantController.php:61
* @route '/projects/{project}/ai/ask'
*/
export const ask = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(args, options),
    method: 'post',
})

ask.definition = {
    methods: ["post"],
    url: '/projects/{project}/ai/ask',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AiAssistantController::ask
* @see app/Http/Controllers/AiAssistantController.php:61
* @route '/projects/{project}/ai/ask'
*/
ask.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return ask.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AiAssistantController::ask
* @see app/Http/Controllers/AiAssistantController.php:61
* @route '/projects/{project}/ai/ask'
*/
ask.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAssistantController::ask
* @see app/Http/Controllers/AiAssistantController.php:61
* @route '/projects/{project}/ai/ask'
*/
const askForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AiAssistantController::ask
* @see app/Http/Controllers/AiAssistantController.php:61
* @route '/projects/{project}/ai/ask'
*/
askForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ask.url(args, options),
    method: 'post',
})

ask.form = askForm

const ai = {
    index: Object.assign(index, index),
    ask: Object.assign(ask, ask),
}

export default ai