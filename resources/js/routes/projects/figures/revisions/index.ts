import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FigureController::restore
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
export const restore = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/projects/{project}/figures/{figure}/revisions/{revision}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FigureController::restore
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
restore.url = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            figure: args[1],
            revision: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        figure: typeof args.figure === 'object'
        ? args.figure.public_id
        : args.figure,
        revision: typeof args.revision === 'object'
        ? args.revision.public_id
        : args.revision,
    }

    return restore.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{figure}', parsedArgs.figure.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FigureController::restore
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
restore.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::restore
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
const restoreForm = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FigureController::restore
* @see app/Http/Controllers/FigureController.php:177
* @route '/projects/{project}/figures/{figure}/revisions/{revision}/restore'
*/
restoreForm.post = (args: { project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, figure: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

restore.form = restoreForm

const revisions = {
    restore: Object.assign(restore, restore),
}

export default revisions