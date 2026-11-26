# Public Website & Landing Page — Project Specification

**Purpose:** Product, design, UX, content, backend, implementation, and acceptance specification for the public website of the independent LaTeX and research-writing platform.

**Target stack**
- Laravel 13 / PHP
- Inertia.js 3
- Vue 3.5 / TypeScript
- Tailwind CSS 4.1
- **shadcn-vue as the exclusive UI component system** across the public website, authenticated portal, and admin interface
- MySQL
- Redis where caching, queues, or rate limiting require it
- Existing application authentication, authorization, settings, and billing foundations where available

> This package specifies the public website only. It does not authorize replacing or restructuring the authenticated editor, compiler, collaboration, or worker architecture.

## Documents

1. `01-product-and-scope.md` — objectives, audiences, positioning, scope and exclusions.
2. `02-information-architecture.md` — sitemap, navigation, page hierarchy and routes.
3. `03-visual-design-system.md` — brand direction, responsive system, components and accessibility.
4. `04-page-specifications.md` — detailed content and behaviour for every public page.
5. `05-pricing-and-admin-settings.md` — pricing visibility rules and administration.
6. `06-interactive-demo.md` — safe, realistic editor/PDF demo specification.
7. `07-content-and-copy.md` — content principles and initial copy.
8. `08-technical-implementation.md` — Laravel/Inertia/Vue/Tailwind architecture and implementation guidance.
9. `09-data-model-and-admin.md` — public-site data, settings, contact enquiries and administration.
10. `10-seo-performance-accessibility.md` — SEO, performance, accessibility and analytics.
11. `11-security-and-privacy.md` — security, privacy and abuse prevention.
12. `12-testing-and-acceptance.md` — test plan and acceptance criteria.
13. `13-implementation-roadmap.md` — phased delivery plan.
14. `14-coding-agent-master-prompt.md` — implementation prompt for a coding agent.
15. `15-design-reference-and-mockups.md` — guidance for translating the visual references into production UI.

## Core product positioning

A professional research-writing workspace for authors who need a dependable LaTeX workflow, live PDF compilation, academic tooling, collaboration, and optional AI assistance — with transparent control over their projects and documents.

Do not imply that the platform has a proprietary, fully TeX-compatible typesetting engine unless that has actually been built and validated. Describe the initial compiler accurately as a managed, sandboxed TeX Live-based compilation service behind the platform's own orchestration layer.

## Non-negotiable requirements

- Public pages must be responsive, accessible, fast, and SEO-friendly.
- Pricing must be data-driven and hidden when the application is configured as completely free **or** when no active plans are available.
- Never render empty pricing sections, empty plan cards, or dead pricing CTAs.
- Contact submissions must be validated, rate-limited, stored safely, and manageable by authorized administrators.
- The demo must use synthetic sample content and must not expose real user projects, source files, credentials, or compiler infrastructure.
- Public marketing pages must not leak private application configuration or admin-only settings.
- All application UI components must use shadcn-vue. Do not introduce another component library or build parallel bespoke UI primitives. Native semantic HTML remains appropriate for page structure and content.
- Reuse the project's existing design tokens, auth, route conventions, and components where appropriate; inspect the repository before changing anything.
- Implement in phases, run tests, and report assumptions. Do not silently invent product capabilities, prices, SLAs, security certifications, or customer testimonials.
