import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/compiler',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::index
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:18
* @route '/admin/compiler'
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
* @see \App\Http\Controllers\Admin\CompilerSettingsController::update
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:26
* @route '/admin/compiler'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/compiler',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::update
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:26
* @route '/admin/compiler'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::update
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:26
* @route '/admin/compiler'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::update
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:26
* @route '/admin/compiler'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::update
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:26
* @route '/admin/compiler'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::test
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:52
* @route '/admin/compiler/test'
*/
export const test = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/admin/compiler/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::test
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:52
* @route '/admin/compiler/test'
*/
test.url = (options?: RouteQueryOptions) => {
    return test.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::test
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:52
* @route '/admin/compiler/test'
*/
test.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::test
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:52
* @route '/admin/compiler/test'
*/
const testForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CompilerSettingsController::test
* @see app/Http/Controllers/Admin/CompilerSettingsController.php:52
* @route '/admin/compiler/test'
*/
testForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(options),
    method: 'post',
})

test.form = testForm

const compiler = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
    test: Object.assign(test, test),
}

export default compiler