# 3. Visual Design System

## 3.1 Art direction

Create a premium, modern academic-technology identity. It should feel like a serious research productivity product rather than a generic SaaS template.

Visual attributes:
- Calm, confident, precise and editorial.
- Warm near-white canvas with deep ink/navy typography.
- Restrained blue/indigo accent for primary actions.
- Muted teal or violet as a secondary accent, used sparingly.
- Soft borders, subtle shadows, generous spacing and strong alignment.
- Product UI imagery should be the visual focus, not decorative gradients.

Avoid:
- Excessive gradients and glowing blobs.
- Too many rounded cards.
- Tiny low-contrast text.
- Generic stock photography of people in meetings.
- Fake customer logos, invented usage metrics or fake testimonials.
- Screenshots with illegible gibberish or inconsistent UI labels.

## 3.2 Suggested design tokens

Use CSS variables/Tailwind theme tokens, adjusted to the existing brand if one exists.

- `--color-ink`: deep navy/charcoal.
- `--color-muted`: cool slate.
- `--color-canvas`: warm off-white.
- `--color-surface`: white.
- `--color-border`: pale slate.
- `--color-primary`: saturated academic blue.
- `--color-primary-hover`: deeper blue.
- `--color-accent`: muted teal.
- `--radius-card`: 1rem to 1.25rem.
- `--shadow-soft`: restrained, diffuse elevation.

Do not hard-code a large number of arbitrary colors in individual components. Centralize tokens.

## 3.3 Typography

- Use a highly legible sans-serif for interface and body copy.
- Optional restrained serif display face for selected editorial headings, only if licensing and performance are acceptable.
- Use consistent typographic scale and line length.
- Body copy should be readable at 16–18px on desktop and mobile.
- Avoid long all-caps headings.

## 3.4 Layout

- Main content max width: approximately 1200–1320px.
- Desktop sections use 12-column grid or consistent flex/grid primitives.
- Hero: two-column composition on desktop; stacked on mobile.
- Feature sections alternate between concise copy and product UI visuals.
- Use a consistent vertical spacing rhythm.
- Avoid horizontal overflow at 320px viewport width.

## 3.5 Hero composition

Left:
- Small eyebrow label, e.g. “A focused workspace for academic writing”.
- Main headline: “Research writing, from source to finished paper.”
- Short subheading describing LaTeX editing, compilation, PDF preview, collaboration and optional AI assistance.
- Primary CTA and secondary demo CTA.
- Short trust/clarity line such as “Your source stays editable. Your workflow stays in view.” Do not make unsupported privacy claims.

Right:
- High-quality product mockup: editor pane, file tree, PDF preview, compile status.
- Show plausible LaTeX source and a clean rendered academic page.
- Keep labels legible at desktop presentation size.
- Product UI should not suggest unsupported capabilities.

## 3.6 Feature presentation

Use 6–9 feature cards on home, with a dedicated full feature page. Suggested groupings:
- LaTeX editor and project workspace.
- Live compilation and PDF preview.
- Bibliography and citations.
- Collaboration and review.
- AI assistance with human approval.
- Visual academic tools.
- Import/export and document conversion.
- OCR-assisted equation capture.
- Git and reference-manager integrations.

Only render features with approved status. Mark beta/planned items clearly.

## 3.7 Demo visual

A large browser-like frame with:
- Left project/file sidebar.
- Central Monaco-like editor representation (static visual only unless the demo is implemented).
- Right PDF preview.
- Bottom compile output/status panel.
- Small toolbar with compiler selection and compile control.
- A demo interaction that changes tabs or sample snippets, not an actual compiler invocation.

Clearly label as “Interactive product preview” if it is a frontend simulation. Never imply that a sample button has compiled real TeX unless it actually calls a secured compiler service.

## 3.8 Responsive behaviour

- 1440px: full hero split and full demo frame.
- 1024px: reduce columns, keep demo legible.
- 768px: stacked hero; demo may become tabbed panels.
- 390px: simplified product preview, horizontal scrolling confined to code pane only.
- 320px: no page-level horizontal overflow; nav and buttons wrap gracefully.

## 3.9 Motion

- Prefer subtle opacity/translate transitions.
- Respect `prefers-reduced-motion`.
- No autoplay video with sound.
- Avoid parallax and excessive scroll animation.
- Keep interaction feedback immediate and consistent.

## 3.10 Accessibility

- Semantic landmarks and heading order.
- Keyboard-accessible navigation, accordion and demo controls.
- Visible focus rings.
- Text/background contrast meeting WCAG 2.2 AA where applicable.
- Alt text for meaningful product imagery; decorative visuals use empty alt.
- Forms have labels, descriptions and error associations.
- Do not communicate feature availability by colour alone.


## 3.11 Mandatory component-system standard: shadcn-vue

**shadcn-vue is the exclusive UI component system** for the entire product frontend:
- Public marketing website.
- Authenticated research-writing portal.
- Admin and management portal.
- Settings, forms, dialogs, menus, notifications and other interactive surfaces.

Rules:
1. Use shadcn-vue components for interactive controls and reusable UI patterns wherever an appropriate component exists.
2. Do not introduce PrimeVue, Vuetify, Quasar, Element Plus, Bootstrap Vue, Headless UI, DaisyUI, or another competing component library.
3. Do not create a parallel bespoke component framework for buttons, inputs, dialogs, menus, tabs, cards, alerts, tables, tooltips or similar patterns.
4. Compose and theme shadcn-vue components to achieve the product's visual identity. A branded wrapper around a shadcn-vue component is acceptable when it preserves the component's accessibility and behaviour.
5. Native semantic HTML (`main`, `section`, `header`, `footer`, headings, paragraphs, lists, `article`, `nav`) is expected for document structure and content. The requirement is not to wrap every HTML element in a component.
6. Use Tailwind CSS 4.1 for layout, spacing, responsive behaviour and theming, while keeping component behaviour and accessibility consistent with shadcn-vue.
7. Inspect the installed shadcn-vue version and generated component conventions before adding or updating components. Do not assume every component is installed.
8. Add only the components actually required. Follow the project's chosen shadcn-vue installation and registry conventions; do not copy component source from unrelated versions.
9. Keep accessible keyboard interactions, focus management, ARIA semantics and form validation behaviour intact when composing components.

Recommended component mapping (confirm availability in the installed version):

| UI need | Preferred shadcn-vue component |
|---|---|
| Primary/secondary actions | Button |
| Feature/plan/content surfaces | Card |
| Notices and inline feedback | Alert |
| Destructive/important confirmation | AlertDialog |
| General modal content | Dialog |
| Mobile navigation / side panels | Sheet |
| Text fields | Input |
| Long-form fields | Textarea |
| Field grouping and validation | Form + FormField / project form integration |
| Choice controls | Select, RadioGroup, Checkbox, Switch |
| Tabs in demo or settings | Tabs |
| FAQ | Accordion |
| Navigation dropdowns | NavigationMenu, DropdownMenu |
| Context actions | DropdownMenu |
| Status labels | Badge |
| Data tables | Table |
| Tooltips | Tooltip |
| Popovers | Popover |
| Date/time selection | Calendar / DatePicker composition, if installed |
| Toast notifications | Sonner or the project's installed shadcn-vue toast solution |
| Progress / loading | Progress, Skeleton |
| Command/search palette | Command + Dialog |
| Pagination | Pagination |
| Breadcrumbs | Breadcrumb |
| Avatar / user menu | Avatar, DropdownMenu |
| Separators | Separator |
| Scrollable panels | ScrollArea |

Do not use a component merely because it exists. Choose the simplest accessible component that matches the interaction.
