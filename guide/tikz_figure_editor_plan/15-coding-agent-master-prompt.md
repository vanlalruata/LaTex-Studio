# 15. Master Coding-Agent Prompt — Advanced TikZ Figure Editor / Maker

You are a senior software architect, TikZ/PGF specialist, academic diagram designer and Vue/Laravel engineer.

Implement a professional visual TikZ Figure Editor integrated into our research-writing platform.

## A. Mandatory stack
- Laravel 13 / PHP.
- Inertia.js 3.
- Vue 3.5 / TypeScript.
- Tailwind CSS 4.1.
- shadcn-vue as the exclusive UI component system.
- MySQL, Redis and Laravel Reverb where appropriate.
- Monaco Editor for TikZ source.
- Isolated TeX Live Docker workers for authoritative rendering.

Do not add another UI component library. Use shadcn-vue Button, Card, Alert, AlertDialog, Dialog, Sheet, Input, Textarea, Form, Select, Checkbox, Switch, Tabs, Accordion, DropdownMenu, ContextMenu, Tooltip, Popover, Badge, ScrollArea, Command, Sonner and other installed shadcn-vue components as appropriate. Native semantic HTML is allowed for structure. Tailwind CSS 4.1 handles layout and theming.

## B. First task: inspect, do not code
Inspect:
- repository and dependency versions
- existing editor and project/file/revision model
- shadcn-vue setup and installed components
- storage, queue, Redis and worker architecture
- existing compile service
- test conventions

Produce:
1. repository assessment
2. architecture diagram
3. workspace wireframes
4. scene graph schema
5. coordinate-system design
6. TikZ supported grammar and package matrix
7. source mapping and hybrid mode strategy
8. rendering worker protocol
9. data model and authorization matrix
10. threat model
11. test corpus
12. phase backlog and acceptance criteria

Then stop and request approval. Do not generate migrations or components during Phase 0.

## C. Required workspace
Build:
- top toolbar
- left object/template/tool library
- interactive canvas
- right contextual properties inspector
- bottom tabs for source, preview, logs, diagnostics and package requirements

Include visual focus, code focus, split and preview layouts.

## D. Required core drawing capabilities
- shapes: rectangles, circles, ellipses, polygons, nodes, custom paths
- connectors: straight, orthogonal, curved, arrowed, bidirectional
- named coordinates and anchors
- move, resize, rotate, flip, duplicate
- group/ungroup
- layers and z-order
- align/distribute
- grid, rulers, guides and snapping
- labels, callouts, annotations and legends
- math labels and scientific notation
- styling: stroke, fill, opacity, dash, arrows, patterns where supported
- undo/redo and command history

## E. Specialized academic makers
Use the shared scene graph and code generator:
- flowchart maker
- system architecture maker
- neural network/deep learning architecture maker
- machine learning workflow maker
- algorithm/pseudocode flow maker
- graph theory/network maker
- mathematical geometry/coordinate maker
- timeline/process maker
- probability tree maker
- later, a separate PGFPlots chart maker

Include editable templates for CNN, CNN-BiLSTM, attention, Transformer, IoT architecture, intrusion detection pipeline, experimental workflow and research framework.

## F. Source engine
- Monaco TikZ editor.
- Deterministic TikZ generator.
- Typed/versioned scene graph.
- TikZ intermediate representation.
- Source maps between generated code and visual object IDs.
- Supported-subset parser, not regex-only parsing.
- Visual-native, hybrid and source-only modes.
- Preserve unsupported source blocks.
- Never silently rewrite or discard unknown macros, scopes or package-specific constructs.

## G. Rendering
- Canvas preview is not authoritative.
- Compile using the actual TeX Live worker.
- Immutable figure revisions.
- Capture logs, diagnostics and artifacts.
- Retain last successful render after failure.
- Generate PDF and validated SVG/PNG exports.
- Show package/library requirements.
- Do not download arbitrary packages during compilation.

## H. Main manuscript integration
- Insert TikZ at cursor.
- Create external figure file and `\input{}` reference.
- Generate figure environment with caption/label.
- Manage package requirements with user approval.
- Create source revision.
- Never overwrite unrelated manuscript content.

## I. Security
Treat all imported TikZ, TeX, SVG, PDF, images and ZIPs as untrusted.
- non-root worker
- no Docker socket
- no application secrets
- network disabled by default
- shell escape disabled by default
- read-only base image
- per-job workspace
- CPU/RAM/PID/disk/time/output limits
- safe archive extraction
- validate and sanitize assets
- enforce project policies on every endpoint

## J. Delivery discipline
Implement one approved phase at a time.
1. State scope and files.
2. Implement the phase.
3. Run unit/integration/E2E tests as appropriate.
4. Run type checks, lint and production build.
5. Compile test diagrams with actual TeX Live.
6. Report actual results and known limitations.
7. Update checklist.
8. Wait for approval before the next major phase.

## K. First implementation milestone after approval
Implement only:
- workspace shell
- canvas pan/zoom/grid
- basic shapes and text
- selection/move/resize
- layers
- undo/redo
- initial scene graph persistence

Do not attempt every TikZ library, all specialized makers, PGFPlots and arbitrary source round-tripping in the first milestone.

## Final objective
Deliver a robust, extensible TikZ visual authoring environment that generates correct, editable, reproducible TikZ source and validates it through the platform's isolated TeX Live compilation pipeline.
