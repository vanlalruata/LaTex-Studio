import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BibliographyLookupController::__invoke
* @see app/Http/Controllers/BibliographyLookupController.php:15
* @route '/projects/{project}/bibliography/lookup'
*/
const BibliographyLookupController = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: BibliographyLookupController.url(args, options),
    method: 'post',
})

BibliographyLookupController.definition = {
    methods: ["post"],
    url: '/projects/{project}/bibliography/lookup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BibliographyLookupController::__invoke
* @see app/Http/Controllers/BibliographyLookupController.php:15
* @route '/projects/{project}/bibliography/lookup'
*/
BibliographyLookupController.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'public_id' in args) {
        args = { project: args.public_id }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
    }

    return BibliographyLookupController.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BibliographyLookupController::__invoke
* @see app/Http/Controllers/BibliographyLookupController.php:15
* @route '/projects/{project}/bibliography/lookup'
*/
BibliographyLookupController.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: BibliographyLookupController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyLookupController::__invoke
* @see app/Http/Controllers/BibliographyLookupController.php:15
* @route '/projects/{project}/bibliography/lookup'
*/
const BibliographyLookupControllerForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: BibliographyLookupController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BibliographyLookupController::__invoke
* @see app/Http/Controllers/BibliographyLookupController.php:15
* @route '/projects/{project}/bibliography/lookup'
*/
BibliographyLookupControllerForm.post = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: BibliographyLookupController.url(args, options),
    method: 'post',
})

BibliographyLookupController.form = BibliographyLookupControllerForm

export default BibliographyLookupController