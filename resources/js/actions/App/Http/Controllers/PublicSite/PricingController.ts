import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
const PricingController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PricingController.url(options),
    method: 'get',
})

PricingController.definition = {
    methods: ["get","head"],
    url: '/pricing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
PricingController.url = (options?: RouteQueryOptions) => {
    return PricingController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
PricingController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PricingController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
PricingController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PricingController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
const PricingControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PricingController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
PricingControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PricingController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
PricingControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: PricingController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

PricingController.form = PricingControllerForm

export default PricingController