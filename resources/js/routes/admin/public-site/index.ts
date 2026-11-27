import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import settings from './settings'
import plans from './plans'
import enquiries from './enquiries'
import features from './features'
import templates from './templates'
/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/public-site',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::index
* @see app/Http/Controllers/Admin/PublicSiteController.php:20
* @route '/admin/public-site'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const publicSite = {
    index: Object.assign(index, index),
    settings: Object.assign(settings, settings),
    plans: Object.assign(plans, plans),
    enquiries: Object.assign(enquiries, enquiries),
    features: Object.assign(features, features),
    templates: Object.assign(templates, templates),
}

export default publicSite