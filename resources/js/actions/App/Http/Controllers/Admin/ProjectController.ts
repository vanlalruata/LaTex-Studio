import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::index
* @see app/Http/Controllers/Admin/ProjectController.php:16
* @route '/admin/projects'
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
* @see \App\Http\Controllers\Admin\ProjectController::archive
* @see app/Http/Controllers/Admin/ProjectController.php:55
* @route '/admin/projects/{project}/archive'
*/
export const archive = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archive.url(args, options),
    method: 'patch',
})

archive.definition = {
    methods: ["patch"],
    url: '/admin/projects/{project}/archive',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\ProjectController::archive
* @see app/Http/Controllers/Admin/ProjectController.php:55
* @route '/admin/projects/{project}/archive'
*/
archive.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return archive.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProjectController::archive
* @see app/Http/Controllers/Admin/ProjectController.php:55
* @route '/admin/projects/{project}/archive'
*/
archive.patch = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: archive.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::archive
* @see app/Http/Controllers/Admin/ProjectController.php:55
* @route '/admin/projects/{project}/archive'
*/
const archiveForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::archive
* @see app/Http/Controllers/Admin/ProjectController.php:55
* @route '/admin/projects/{project}/archive'
*/
archiveForm.patch = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: archive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

archive.form = archiveForm

/**
* @see \App\Http\Controllers\Admin\ProjectController::bulkArchive
* @see app/Http/Controllers/Admin/ProjectController.php:73
* @route '/admin/projects/bulk-archive'
*/
export const bulkArchive = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkArchive.url(options),
    method: 'post',
})

bulkArchive.definition = {
    methods: ["post"],
    url: '/admin/projects/bulk-archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ProjectController::bulkArchive
* @see app/Http/Controllers/Admin/ProjectController.php:73
* @route '/admin/projects/bulk-archive'
*/
bulkArchive.url = (options?: RouteQueryOptions) => {
    return bulkArchive.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProjectController::bulkArchive
* @see app/Http/Controllers/Admin/ProjectController.php:73
* @route '/admin/projects/bulk-archive'
*/
bulkArchive.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkArchive.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::bulkArchive
* @see app/Http/Controllers/Admin/ProjectController.php:73
* @route '/admin/projects/bulk-archive'
*/
const bulkArchiveForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkArchive.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProjectController::bulkArchive
* @see app/Http/Controllers/Admin/ProjectController.php:73
* @route '/admin/projects/bulk-archive'
*/
bulkArchiveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkArchive.url(options),
    method: 'post',
})

bulkArchive.form = bulkArchiveForm

const ProjectController = { index, archive, bulkArchive }

export default ProjectController