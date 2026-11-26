import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
const DemoController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DemoController.url(options),
    method: 'get',
})

DemoController.definition = {
    methods: ["get","head"],
    url: '/demo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
DemoController.url = (options?: RouteQueryOptions) => {
    return DemoController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
DemoController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DemoController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
DemoController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DemoController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
    const DemoControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: DemoController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
        DemoControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DemoController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
 * @see app/Http/Controllers/PublicSite/DemoController.php:11
 * @route '/demo'
 */
        DemoControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DemoController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    DemoController.form = DemoControllerForm
export default DemoController