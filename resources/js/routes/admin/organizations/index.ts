import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import quota from './quota'
/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\OrganizationController::index
 * @see app/Http/Controllers/Admin/OrganizationController.php:15
 * @route '/admin/organizations'
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
const organizations = {
    index: Object.assign(index, index),
quota: Object.assign(quota, quota),
}

export default organizations