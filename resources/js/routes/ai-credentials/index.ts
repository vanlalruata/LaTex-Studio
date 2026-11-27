import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/ai-keys',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::edit
* @see app/Http/Controllers/Settings/AiCredentialController.php:17
* @route '/settings/ai-keys'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::store
* @see app/Http/Controllers/Settings/AiCredentialController.php:47
* @route '/settings/ai-keys'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/ai-keys',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::store
* @see app/Http/Controllers/Settings/AiCredentialController.php:47
* @route '/settings/ai-keys'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::store
* @see app/Http/Controllers/Settings/AiCredentialController.php:47
* @route '/settings/ai-keys'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::store
* @see app/Http/Controllers/Settings/AiCredentialController.php:47
* @route '/settings/ai-keys'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::store
* @see app/Http/Controllers/Settings/AiCredentialController.php:47
* @route '/settings/ai-keys'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::destroy
* @see app/Http/Controllers/Settings/AiCredentialController.php:85
* @route '/settings/ai-keys/{credential}'
*/
export const destroy = (args: { credential: string | number | { public_id: string | number } } | [credential: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/ai-keys/{credential}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::destroy
* @see app/Http/Controllers/Settings/AiCredentialController.php:85
* @route '/settings/ai-keys/{credential}'
*/
destroy.url = (args: { credential: string | number | { public_id: string | number } } | [credential: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { credential: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { credential: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            credential: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        credential: typeof args.credential === 'object'
        ? args.credential.public_id
        : args.credential,
    }

    return destroy.definition.url
            .replace('{credential}', parsedArgs.credential.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::destroy
* @see app/Http/Controllers/Settings/AiCredentialController.php:85
* @route '/settings/ai-keys/{credential}'
*/
destroy.delete = (args: { credential: string | number | { public_id: string | number } } | [credential: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::destroy
* @see app/Http/Controllers/Settings/AiCredentialController.php:85
* @route '/settings/ai-keys/{credential}'
*/
const destroyForm = (args: { credential: string | number | { public_id: string | number } } | [credential: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\AiCredentialController::destroy
* @see app/Http/Controllers/Settings/AiCredentialController.php:85
* @route '/settings/ai-keys/{credential}'
*/
destroyForm.delete = (args: { credential: string | number | { public_id: string | number } } | [credential: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const aiCredentials = {
    edit: Object.assign(edit, edit),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default aiCredentials