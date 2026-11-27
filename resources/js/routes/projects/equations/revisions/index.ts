import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EquationController::restore
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
export const restore = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/projects/{project}/equations/{equation}/revisions/{revision}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EquationController::restore
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
restore.url = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            equation: args[1],
            revision: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        equation: typeof args.equation === 'object'
        ? args.equation.public_id
        : args.equation,
        revision: typeof args.revision === 'object'
        ? args.revision.public_id
        : args.revision,
    }

    return restore.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{equation}', parsedArgs.equation.toString())
            .replace('{revision}', parsedArgs.revision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EquationController::restore
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
restore.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::restore
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
const restoreForm = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EquationController::restore
* @see app/Http/Controllers/EquationController.php:180
* @route '/projects/{project}/equations/{equation}/revisions/{revision}/restore'
*/
restoreForm.post = (args: { project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, equation: string | number | { public_id: string | number }, revision: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

restore.form = restoreForm

const revisions = {
    restore: Object.assign(restore, restore),
}

export default revisions