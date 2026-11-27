import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import files from './files'
import revisions from './revisions'
import compilations from './compilations'
import engine from './engine'
import tasks from './tasks'
import milestones from './milestones'
import integrations from './integrations'
import git from './git'
import researchAssets from './research-assets'
import bibliography from './bibliography'
import ocr from './ocr'
import conversions from './conversions'
import annotations from './annotations'
import presence from './presence'
import members from './members'
import comments from './comments'
import suggestions from './suggestions'
import chat from './chat'
import tables from './tables'
import figures from './figures'
import equations from './equations'
import ai from './ai'
/**
* @see \App\Http\Controllers\ProjectController::store
* @see app/Http/Controllers/ProjectController.php:26
* @route '/projects'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProjectController::store
* @see app/Http/Controllers/ProjectController.php:26
* @route '/projects'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectController::store
* @see app/Http/Controllers/ProjectController.php:26
* @route '/projects'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectController::store
* @see app/Http/Controllers/ProjectController.php:26
* @route '/projects'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectController::store
* @see app/Http/Controllers/ProjectController.php:26
* @route '/projects'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
export const show = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
show.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
show.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
show.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
const showForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
showForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectController::show
* @see app/Http/Controllers/ProjectController.php:53
* @route '/projects/{project}'
*/
showForm.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\ProjectController::update
* @see app/Http/Controllers/ProjectController.php:163
* @route '/projects/{project}'
*/
export const update = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/projects/{project}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProjectController::update
* @see app/Http/Controllers/ProjectController.php:163
* @route '/projects/{project}'
*/
update.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectController::update
* @see app/Http/Controllers/ProjectController.php:163
* @route '/projects/{project}'
*/
update.patch = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProjectController::update
* @see app/Http/Controllers/ProjectController.php:163
* @route '/projects/{project}'
*/
const updateForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectController::update
* @see app/Http/Controllers/ProjectController.php:163
* @route '/projects/{project}'
*/
updateForm.patch = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ProjectController::destroy
* @see app/Http/Controllers/ProjectController.php:177
* @route '/projects/{project}'
*/
export const destroy = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProjectController::destroy
* @see app/Http/Controllers/ProjectController.php:177
* @route '/projects/{project}'
*/
destroy.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectController::destroy
* @see app/Http/Controllers/ProjectController.php:177
* @route '/projects/{project}'
*/
destroy.delete = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProjectController::destroy
* @see app/Http/Controllers/ProjectController.php:177
* @route '/projects/{project}'
*/
const destroyForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProjectController::destroy
* @see app/Http/Controllers/ProjectController.php:177
* @route '/projects/{project}'
*/
destroyForm.delete = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
export const exportMethod = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
exportMethod.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
exportMethod.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
exportMethod.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
const exportMethodForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
exportMethodForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectController::exportMethod
* @see app/Http/Controllers/ProjectController.php:187
* @route '/projects/{project}/export'
*/
exportMethodForm.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
export const index = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/index',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
index.url = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
index.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
index.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
const indexForm = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
indexForm.get = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProjectIndexController::__invoke
* @see app/Http/Controllers/ProjectIndexController.php:12
* @route '/projects/{project}/index'
*/
indexForm.head = (args: { project: string | { public_id: string } } | [project: string | { public_id: string } ] | string | { public_id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const projects = {
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    export: Object.assign(exportMethod, exportMethod),
    files: Object.assign(files, files),
    revisions: Object.assign(revisions, revisions),
    index: Object.assign(index, index),
    compilations: Object.assign(compilations, compilations),
    engine: Object.assign(engine, engine),
    tasks: Object.assign(tasks, tasks),
    milestones: Object.assign(milestones, milestones),
    integrations: Object.assign(integrations, integrations),
    git: Object.assign(git, git),
    researchAssets: Object.assign(researchAssets, researchAssets),
    bibliography: Object.assign(bibliography, bibliography),
    ocr: Object.assign(ocr, ocr),
    conversions: Object.assign(conversions, conversions),
    annotations: Object.assign(annotations, annotations),
    presence: Object.assign(presence, presence),
    members: Object.assign(members, members),
    comments: Object.assign(comments, comments),
    suggestions: Object.assign(suggestions, suggestions),
    chat: Object.assign(chat, chat),
    tables: Object.assign(tables, tables),
    figures: Object.assign(figures, figures),
    equations: Object.assign(equations, equations),
    ai: Object.assign(ai, ai),
}

export default projects