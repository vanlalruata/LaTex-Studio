import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
export const privacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

privacy.definition = {
    methods: ["get","head"],
    url: '/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacy.url = (options?: RouteQueryOptions) => {
    return privacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacy.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
const privacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

privacy.form = privacyForm

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
export const terms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

terms.definition = {
    methods: ["get","head"],
    url: '/terms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
terms.url = (options?: RouteQueryOptions) => {
    return terms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
terms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
terms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terms.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
const termsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
termsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
termsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

terms.form = termsForm

const LegalController = { privacy, terms }

export default LegalController