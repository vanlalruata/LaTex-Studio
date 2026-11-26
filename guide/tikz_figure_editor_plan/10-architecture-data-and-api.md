# 10. Architecture, Data and API

## 10.1 Frontend
- Vue/Inertia workspace.
- SVG-based canvas renderer with object interaction.
- Monaco source editor.
- Properties inspector.
- shadcn-vue UI components.
- Preview and artifact viewer.
- State/history engine.

Choose or implement a canvas interaction layer after a technical proof of concept. Do not bind the product's canonical model directly to a third-party canvas library's internal object schema.

## 10.2 Backend
Laravel owns:
- authentication and project membership.
- figure metadata and revisions.
- scene model persistence.
- templates and style profiles.
- package requirement validation.
- render job orchestration.
- artifact metadata.
- permissions and audit.
- insertion into manuscript files.

## 10.3 Worker plane
- TeX Live compile worker.
- PDF conversion/rasterization worker.
- Optional asset processing worker.
No compilation or shell execution in Laravel web requests.

## 10.4 Suggested entities
Reuse project/file/revision tables where possible.

Potential:
- figures
- figure_revisions
- figure_artifacts
- figure_templates
- figure_style_profiles
- figure_render_jobs
- figure_assets
- figure_collaborators (or project membership relation)
- figure_comments (optional integration with existing comment model)

## 10.5 Figure document schema
Suggested fields:
- schemaVersion
- id
- title
- canvas settings
- scene graph objects
- groups/layers
- styles
- package/library requirements
- source mode
- raw/protected source segments
- generated source
- source map
- metadata (caption, label, alt text)
- revision/checksum

## 10.6 APIs
- create/update figure.
- retrieve revision.
- create revision.
- import TikZ source.
- parse supported TikZ subset.
- generate source.
- validate source/model.
- enqueue render.
- retrieve render status/artifacts.
- list templates.
- insert into manuscript.
- export figure.

All endpoints enforce project policies and validate payload sizes.
