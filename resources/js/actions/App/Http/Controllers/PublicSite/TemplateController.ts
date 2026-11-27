import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
const TemplateController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: TemplateController.url(options),
    method: 'get',
})

TemplateController.definition = {
    methods: ["get","head"],
    url: '/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
TemplateController.url = (options?: RouteQueryOptions) => {
    return TemplateController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
TemplateController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: TemplateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
TemplateController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: TemplateController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
const TemplateControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: TemplateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
TemplateControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: TemplateController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
TemplateControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: TemplateController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

TemplateController.form = TemplateControllerForm

export default TemplateController