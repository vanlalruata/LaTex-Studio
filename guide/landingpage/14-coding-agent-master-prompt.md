# 14. Master Coding-Agent Prompt — Public Website

You are a senior Laravel 13, Inertia.js 3, Vue 3.5, TypeScript and Tailwind CSS 4.1 architect and product designer. Implement the public marketing website for an independently engineered LaTeX and research-writing platform.

## A. First: inspect, do not code blindly

Inspect the existing repository and report:
1. Laravel/PHP versions.
2. Inertia/Vue/TypeScript/Tailwind versions and build setup.
3. Existing route structure and public/authenticated layouts.
4. Existing settings, pricing/billing, admin, permissions, media and contact models.
5. Existing design tokens and UI components.
6. Existing tests, linting, formatting and CI.
7. Reuse-vs-create recommendations.
8. Potential breaking changes.

Do not upgrade dependencies or replace architecture without explicit justification and approval.

## B. Phase 0 deliverables — stop after producing them

Before writing implementation code, produce:
- Requirements traceability matrix against this specification.
- Sitemap and route table.
- Page wireframes and component inventory.
- Public data contract / Inertia shared-props schema.
- Pricing visibility decision flow.
- Proposed schema changes (only if existing models cannot be reused).
- Authorization matrix for admin features.
- Contact form threat model.
- SEO and accessibility checklist.
- Implementation sequence and acceptance tests.
- Open decisions requiring user input.

Then stop and request approval. Do not generate migrations, controllers or pages until approval is given.

## C. Implementation constraints after approval

### Stack
- Laravel 13 / PHP.
- Inertia.js 3.
- Vue 3.5.
- TypeScript.
- Tailwind CSS 4.1.
- MySQL.
- Reuse the existing application stack and conventions.

### Design
Build a polished, premium academic-technology public site. Use a calm editorial visual language, clear typography, restrained blue accent, warm neutral background, strong product UI previews, generous whitespace and consistent responsive spacing.

Do not produce a generic SaaS template. Do not use fake stock-photo teams, fabricated testimonials, invented usage metrics, fake logos or unsupported certifications.

### Required pages
- Home.
- Features.
- How it works.
- Interactive demo.
- Templates.
- Pricing (conditional).
- About.
- Contact.
- FAQ.
- Privacy.
- Terms.
- Custom 404.

### Home page
Include:
- Hero and primary/secondary CTA.
- Product UI preview.
- Feature highlights.
- Editor/PDF showcase.
- AI assistance with human approval.
- Collaboration/review.
- Visual academic tools.
- Workflow steps.
- Template/use-case section.
- Conditional pricing preview.
- FAQ preview.
- Final CTA and footer.

### Pricing — critical rule
Pricing is visible only when:
1. `pricing_mode` is not `free`.
2. `pricing_page_enabled` is true.
3. At least one active AND public pricing plan exists.

If any condition fails:
- Do not render pricing navigation.
- Do not render pricing footer link.
- Do not render home pricing section.
- Do not include pricing route in sitemap.
- Do not expose plan records through public Inertia props.
- Direct pricing URL follows the configured hidden-route policy.

Centralize this rule in one backend service. Do not rely on frontend-only checks. Include tests for all combinations in the pricing test matrix.

If `contact_sales` mode has no plans, hide pricing unless an explicit contact-sales page presentation has been configured. Never show empty cards.

### Contact
- Validate server-side.
- Rate-limit.
- Use a honeypot and/or approved CAPTCHA.
- Store enquiries securely.
- Notify configured address via queue if available.
- If email is unconfigured, still store and show a truthful success message.
- Add authorized admin inbox or integrate existing ticketing model.
- Do not log full message content.
- Do not support arbitrary file uploads in the initial version.

### Interactive demo
- Synthetic sample project only.
- Static or local sample preview.
- File switching and demo controls can be interactive.
- Any simulated compilation must be explicitly labelled as simulation.
- Do not run arbitrary TeX or shell commands from public demo.
- Do not load Monaco/PDF.js on every marketing page; lazy-load demo-specific assets.

### Feature truthfulness
Use availability states:
- available
- beta
- planned
- disabled

Only advertise verified capabilities as available. Planned/beta must be clearly labelled. Admin should control public visibility and status.

### Security
- Public Inertia props must be allowlisted.
- Admin mutations require policies/permissions.
- Prevent IDOR.
- Validate URLs and prevent open redirects.
- Escape contact enquiry output.
- Protect contact endpoint against spam and abuse.
- Do not expose secrets, internal configuration, worker details or private plans.
- Follow existing CSRF/session/auth practices.

### SEO/performance/accessibility
- Unique metadata, canonical URLs and social metadata.
- Sitemap excludes hidden/private routes.
- Semantic HTML and WCAG 2.2 AA target.
- Keyboard navigation and visible focus.
- Reduced-motion support.
- Responsive at 320px and up.
- Lazy-load images and demo-only dependencies.
- Avoid loading full editor/compiler bundles on public pages.

## D. Coding standards

- Follow existing repository conventions.
- Type page props and shared data.
- Keep controllers thin; move pricing visibility and settings logic into services.
- Use Form Requests for contact validation.
- Use named routes.
- Use Policies for admin authorization.
- Avoid duplicate settings or billing systems.
- Avoid unnecessary dependencies.
- Keep code modular but not over-engineered.
- Write tests alongside features.
- Do not use placeholder links or broken CTAs.
- Do not commit secrets or generated private data.

## E. Required delivery sequence

For each phase:
1. State the exact scope.
2. List files to add/change.
3. Implement only that phase.
4. Run relevant tests, type checks, lint and production build.
5. Report results and any failures.
6. Update implementation checklist.
7. Wait for approval before moving to a materially new phase when requested by the project owner.

## F. Final report

Provide:
- Implemented routes/pages.
- Components created.
- Backend services/models/migrations changed.
- Admin controls.
- Pricing visibility behaviour.
- Contact workflow.
- Test results.
- Build results.
- Accessibility/responsive checks.
- Configuration required.
- Known limitations and next steps.

Do not claim a test passed unless it was run. Do not claim the website is production-ready if security, privacy, legal copy, deployment or acceptance checks remain incomplete.
