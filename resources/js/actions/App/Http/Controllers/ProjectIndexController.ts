import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
const ProjectIndexController = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ProjectIndexController.url(args, options),
    method: 'get',
})

ProjectIndexController.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
ProjectIndexController.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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

    return ProjectIndexController.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
ProjectIndexController.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ProjectIndexController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
ProjectIndexController.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ProjectIndexController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
const ProjectIndexControllerForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ProjectIndexController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
ProjectIndexControllerForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ProjectIndexController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
ProjectIndexControllerForm.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ProjectIndexController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ProjectIndexController.form = ProjectIndexControllerForm

export default ProjectIndexController