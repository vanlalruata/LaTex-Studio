import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
const FeatureController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: FeatureController.url(options),
    method: 'get',
})

FeatureController.definition = {
    methods: ["get","head"],
    url: '/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
FeatureController.url = (options?: RouteQueryOptions) => {
    return FeatureController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
FeatureController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: FeatureController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
FeatureController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: FeatureController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
const FeatureControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: FeatureController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
FeatureControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: FeatureController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
FeatureControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: FeatureController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

FeatureController.form = FeatureControllerForm

export default FeatureController