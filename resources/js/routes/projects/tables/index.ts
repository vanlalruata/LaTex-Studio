import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
export const index = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/tables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
index.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
index.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
index.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
const indexForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
indexForm.get = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TableDesignController::index
* @see app/Http/Controllers/TableDesignController.php:25
* @route '/projects/{project}/tables'
*/
indexForm.head = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\TableDesignController::store
* @see app/Http/Controllers/TableDesignController.php:86
* @route '/projects/{project}/tables'
*/
export const store = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/tables',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TableDesignController::store
* @see app/Http/Controllers/TableDesignController.php:86
* @route '/projects/{project}/tables'
*/
store.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableDesignController::store
* @see app/Http/Controllers/TableDesignController.php:86
* @route '/projects/{project}/tables'
*/
store.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableDesignController::store
* @see app/Http/Controllers/TableDesignController.php:86
* @route '/projects/{project}/tables'
*/
const storeForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableDesignController::store
* @see app/Http/Controllers/TableDesignController.php:86
* @route '/projects/{project}/tables'
*/
storeForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TableDesignController::insert
* @see app/Http/Controllers/TableDesignController.php:155
* @route '/projects/{project}/tables/insert'
*/
export const insert = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insert.url(args, options),
    method: 'post',
})

insert.definition = {
    methods: ["post"],
    url: '/projects/{project}/tables/insert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TableDesignController::insert
* @see app/Http/Controllers/TableDesignController.php:155
* @route '/projects/{project}/tables/insert'
*/
insert.url = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions) => {
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

    return insert.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableDesignController::insert
* @see app/Http/Controllers/TableDesignController.php:155
* @route '/projects/{project}/tables/insert'
*/
insert.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: insert.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableDesignController::insert
* @see app/Http/Controllers/TableDesignController.php:155
* @route '/projects/{project}/tables/insert'
*/
const insertForm = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: insert.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableDesignController::insert
* @see app/Http/Controllers/TableDesignController.php:155
* @route '/projects/{project}/tables/insert'
*/
insertForm.post = (args: { project: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number } ] | string | number | { public_id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: insert.url(args, options),
    method: 'post',
})

insert.form = insertForm

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
export const show = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/tables/{tableDesign}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
show.url = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            tableDesign: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        tableDesign: typeof args.tableDesign === 'object'
        ? args.tableDesign.public_id
        : args.tableDesign,
    }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{tableDesign}', parsedArgs.tableDesign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
show.get = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
show.head = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
const showForm = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
showForm.get = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TableDesignController::show
* @see app/Http/Controllers/TableDesignController.php:57
* @route '/projects/{project}/tables/{tableDesign}'
*/
showForm.head = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TableDesignController::update
* @see app/Http/Controllers/TableDesignController.php:112
* @route '/projects/{project}/tables/{tableDesign}'
*/
export const update = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/tables/{tableDesign}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TableDesignController::update
* @see app/Http/Controllers/TableDesignController.php:112
* @route '/projects/{project}/tables/{tableDesign}'
*/
update.url = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            tableDesign: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        tableDesign: typeof args.tableDesign === 'object'
        ? args.tableDesign.public_id
        : args.tableDesign,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{tableDesign}', parsedArgs.tableDesign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableDesignController::update
* @see app/Http/Controllers/TableDesignController.php:112
* @route '/projects/{project}/tables/{tableDesign}'
*/
update.put = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TableDesignController::update
* @see app/Http/Controllers/TableDesignController.php:112
* @route '/projects/{project}/tables/{tableDesign}'
*/
const updateForm = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableDesignController::update
* @see app/Http/Controllers/TableDesignController.php:112
* @route '/projects/{project}/tables/{tableDesign}'
*/
updateForm.put = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\TableDesignController::destroy
* @see app/Http/Controllers/TableDesignController.php:140
* @route '/projects/{project}/tables/{tableDesign}'
*/
export const destroy = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/tables/{tableDesign}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TableDesignController::destroy
* @see app/Http/Controllers/TableDesignController.php:140
* @route '/projects/{project}/tables/{tableDesign}'
*/
destroy.url = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            tableDesign: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.public_id
        : args.project,
        tableDesign: typeof args.tableDesign === 'object'
        ? args.tableDesign.public_id
        : args.tableDesign,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{tableDesign}', parsedArgs.tableDesign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TableDesignController::destroy
* @see app/Http/Controllers/TableDesignController.php:140
* @route '/projects/{project}/tables/{tableDesign}'
*/
destroy.delete = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TableDesignController::destroy
* @see app/Http/Controllers/TableDesignController.php:140
* @route '/projects/{project}/tables/{tableDesign}'
*/
const destroyForm = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TableDesignController::destroy
* @see app/Http/Controllers/TableDesignController.php:140
* @route '/projects/{project}/tables/{tableDesign}'
*/
destroyForm.delete = (args: { project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } } | [project: string | number | { public_id: string | number }, tableDesign: string | number | { public_id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const tables = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    insert: Object.assign(insert, insert),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default tables