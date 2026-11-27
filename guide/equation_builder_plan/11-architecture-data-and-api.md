# 11. Architecture, Data and API

## 11.1 Frontend
- Vue/Inertia workspace.
- MathLive candidate mathfield adapter.
- Monaco raw LaTeX editor.
- Preview adapter (MathJax/KaTeX).
- Symbol catalogue client/search.
- Structured AST/selection state.
- shadcn-vue controls.

## 11.2 Backend
Laravel owns:
- formula library and metadata
- symbol catalogue versions/custom symbols
- user/project formula collections
- templates/snippets
- equation revisions
- package requirement metadata
- authorization
- insertion and revision orchestration
- audit and activity

## 11.3 Rendering
- Browser preview is client-side and sandboxed.
- Authoritative TeX compilation occurs in isolated workers.
- Do not compile in Laravel web process.
- Cache by source hash and renderer/toolchain version.

## 11.4 Suggested entities
Reuse project and file revision infrastructure where possible.

Potential tables:
- equations
- equation_revisions
- equation_collections
- equation_collection_items
- equation_templates
- equation_snippets
- symbol_catalogue_entries (or versioned JSON catalogue)
- custom_math_symbols
- equation_comments (or shared comment model)
- equation_render_jobs
- equation_artifacts

## 11.5 Equation record
- id
- owner/project
- title
- schema_version
- content_mode
- math_mode
- environment
- structured_document_json nullable
- latex_source
- package_requirements_json
- source_hash
- current_revision_id
- metadata_json

## 11.6 APIs
- symbol search/filter
- list categories
- retrieve symbol metadata
- create/update equation
- create immutable revision
- validate equation
- render preview if server-backed
- save template/snippet
- list user/project formula library
- insert into manuscript
- retrieve revision/history
- export source

All endpoints must validate ownership and project membership.
