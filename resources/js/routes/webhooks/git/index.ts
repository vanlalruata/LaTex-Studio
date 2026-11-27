import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\GitWebhookController::handle
* @see app/Http/Controllers/GitWebhookController.php:12
* @route '/api/webhooks/{provider}/{integration}'
*/
export const handle = (args: { provider: string | number, integration: string | { public_id: string } } | [provider: string | number, integration: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(args, options),
    method: 'post',
})

handle.definition = {
    methods: ["post"],
    url: '/api/webhooks/{provider}/{integration}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GitWebhookController::handle
* @see app/Http/Controllers/GitWebhookController.php:12
* @route '/api/webhooks/{provider}/{integration}'
*/
handle.url = (args: { provider: string | number, integration: string | { public_id: string } } | [provider: string | number, integration: string | { public_id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            provider: args[0],
            integration: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: args.provider,
        integration: typeof args.integration === 'object'
        ? args.integration.public_id
        : args.integration,
    }

    return handle.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GitWebhookController::handle
* @see app/Http/Controllers/GitWebhookController.php:12
* @route '/api/webhooks/{provider}/{integration}'
*/
handle.post = (args: { provider: string | number, integration: string | { public_id: string } } | [provider: string | number, integration: string | { public_id: string } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitWebhookController::handle
* @see app/Http/Controllers/GitWebhookController.php:12
* @route '/api/webhooks/{provider}/{integration}'
*/
const handleForm = (args: { provider: string | number, integration: string | { public_id: string } } | [provider: string | number, integration: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: handle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\GitWebhookController::handle
* @see app/Http/Controllers/GitWebhookController.php:12
* @route '/api/webhooks/{provider}/{integration}'
*/
handleForm.post = (args: { provider: string | number, integration: string | { public_id: string } } | [provider: string | number, integration: string | { public_id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: handle.url(args, options),
    method: 'post',
})

handle.form = handleForm

const git = {
    handle: Object.assign(handle, handle),
}

export default git