import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
const HowItWorksController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HowItWorksController.url(options),
    method: 'get',
})

HowItWorksController.definition = {
    methods: ["get","head"],
    url: '/how-it-works',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
HowItWorksController.url = (options?: RouteQueryOptions) => {
    return HowItWorksController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
HowItWorksController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HowItWorksController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
HowItWorksController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HowItWorksController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
const HowItWorksControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HowItWorksController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
HowItWorksControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HowItWorksController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
HowItWorksControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HowItWorksController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HowItWorksController.form = HowItWorksControllerForm

export default HowItWorksController