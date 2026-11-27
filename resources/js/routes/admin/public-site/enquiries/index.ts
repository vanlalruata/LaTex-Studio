import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/public-site/enquiries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::index
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:15
* @route '/admin/public-site/enquiries'
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
* @see \App\Http\Controllers\Admin\ContactEnquiryController::update
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:30
* @route '/admin/public-site/enquiries/{enquiry}'
*/
export const update = (args: { enquiry: number | { id: number } } | [enquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/public-site/enquiries/{enquiry}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::update
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:30
* @route '/admin/public-site/enquiries/{enquiry}'
*/
update.url = (args: { enquiry: number | { id: number } } | [enquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enquiry: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { enquiry: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            enquiry: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        enquiry: typeof args.enquiry === 'object'
        ? args.enquiry.id
        : args.enquiry,
    }

    return update.definition.url
            .replace('{enquiry}', parsedArgs.enquiry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::update
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:30
* @route '/admin/public-site/enquiries/{enquiry}'
*/
update.patch = (args: { enquiry: number | { id: number } } | [enquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::update
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:30
* @route '/admin/public-site/enquiries/{enquiry}'
*/
const updateForm = (args: { enquiry: number | { id: number } } | [enquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ContactEnquiryController::update
* @see app/Http/Controllers/Admin/ContactEnquiryController.php:30
* @route '/admin/public-site/enquiries/{enquiry}'
*/
updateForm.patch = (args: { enquiry: number | { id: number } } | [enquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const enquiries = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
}

export default enquiries