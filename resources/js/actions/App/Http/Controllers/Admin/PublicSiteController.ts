import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\Admin\PublicSiteController::updateSettings
 * @see app/Http/Controllers/Admin/PublicSiteController.php:42
 * @route '/admin/public-site/settings'
 */
export const updateSettings = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSettings.url(options),
    method: 'put',
})

updateSettings.definition = {
    methods: ["put"],
    url: '/admin/public-site/settings',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::updateSettings
 * @see app/Http/Controllers/Admin/PublicSiteController.php:42
 * @route '/admin/public-site/settings'
 */
updateSettings.url = (options?: RouteQueryOptions) => {
    return updateSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::updateSettings
 * @see app/Http/Controllers/Admin/PublicSiteController.php:42
 * @route '/admin/public-site/settings'
 */
updateSettings.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSettings.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\PublicSiteController::updateSettings
 * @see app/Http/Controllers/Admin/PublicSiteController.php:42
 * @route '/admin/public-site/settings'
 */
    const updateSettingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSettings.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PublicSiteController::updateSettings
 * @see app/Http/Controllers/Admin/PublicSiteController.php:42
 * @route '/admin/public-site/settings'
 */
        updateSettingsForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSettings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSettings.form = updateSettingsForm
/**
* @see \App\Http\Controllers\Admin\PublicSiteController::storePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:67
 * @route '/admin/public-site/plans'
 */
export const storePlan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePlan.url(options),
    method: 'post',
})

storePlan.definition = {
    methods: ["post"],
    url: '/admin/public-site/plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::storePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:67
 * @route '/admin/public-site/plans'
 */
storePlan.url = (options?: RouteQueryOptions) => {
    return storePlan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::storePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:67
 * @route '/admin/public-site/plans'
 */
storePlan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePlan.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PublicSiteController::storePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:67
 * @route '/admin/public-site/plans'
 */
    const storePlanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePlan.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PublicSiteController::storePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:67
 * @route '/admin/public-site/plans'
 */
        storePlanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePlan.url(options),
            method: 'post',
        })
    
    storePlan.form = storePlanForm
/**
* @see \App\Http\Controllers\Admin\PublicSiteController::updatePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:90
 * @route '/admin/public-site/plans/{plan}'
 */
export const updatePlan = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePlan.url(args, options),
    method: 'put',
})

updatePlan.definition = {
    methods: ["put"],
    url: '/admin/public-site/plans/{plan}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::updatePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:90
 * @route '/admin/public-site/plans/{plan}'
 */
updatePlan.url = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return updatePlan.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::updatePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:90
 * @route '/admin/public-site/plans/{plan}'
 */
updatePlan.put = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePlan.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\PublicSiteController::updatePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:90
 * @route '/admin/public-site/plans/{plan}'
 */
    const updatePlanForm = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePlan.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PublicSiteController::updatePlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:90
 * @route '/admin/public-site/plans/{plan}'
 */
        updatePlanForm.put = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePlan.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePlan.form = updatePlanForm
/**
* @see \App\Http\Controllers\Admin\PublicSiteController::destroyPlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:114
 * @route '/admin/public-site/plans/{plan}'
 */
export const destroyPlan = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPlan.url(args, options),
    method: 'delete',
})

destroyPlan.definition = {
    methods: ["delete"],
    url: '/admin/public-site/plans/{plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::destroyPlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:114
 * @route '/admin/public-site/plans/{plan}'
 */
destroyPlan.url = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return destroyPlan.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PublicSiteController::destroyPlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:114
 * @route '/admin/public-site/plans/{plan}'
 */
destroyPlan.delete = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPlan.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\PublicSiteController::destroyPlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:114
 * @route '/admin/public-site/plans/{plan}'
 */
    const destroyPlanForm = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyPlan.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PublicSiteController::destroyPlan
 * @see app/Http/Controllers/Admin/PublicSiteController.php:114
 * @route '/admin/public-site/plans/{plan}'
 */
        destroyPlanForm.delete = (args: { plan: number | { id: number } } | [plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyPlan.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyPlan.form = destroyPlanForm
const PublicSiteController = { index, updateSettings, storePlan, updatePlan, destroyPlan }

export default PublicSiteController